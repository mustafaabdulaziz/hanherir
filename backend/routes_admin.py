import re
import unicodedata
from pathlib import Path
from uuid import uuid4

from flask import Blueprint, current_app, jsonify, request
from PIL import Image, ImageOps

from auth import login_required
from models import (
    LANGS,
    Branch,
    Category,
    Photo,
    Setting,
    db,
    next_sort_order,
    normalize_order,
)
from routes_public import HERO_SLOTS, site_payload

admin_bp = Blueprint("admin", __name__, url_prefix="/api/admin")

ALLOWED_EXT = {".jpg", ".jpeg", ".png", ".webp"}
MAX_SIDE = 1800


class BadRequest(Exception):
    pass


@admin_bp.errorhandler(BadRequest)
def _bad(e):
    return jsonify(error=str(e)), 400


@admin_bp.before_request
@login_required
def _guard():
    return None


# ---------- helpers ----------

def upload_dir() -> Path:
    return Path(current_app.config["UPLOAD_DIR"])


def save_image(storage, stem=None):
    ext = Path(storage.filename or "").suffix.lower()
    if ext not in ALLOWED_EXT:
        raise BadRequest("Sadece JPG, PNG veya WEBP yükleyebilirsiniz.")
    try:
        img = Image.open(storage.stream)
        img = ImageOps.exif_transpose(img)
    except Exception:
        raise BadRequest("Dosya okunamadı. Geçerli bir fotoğraf seçin.")
    if img.mode in ("RGBA", "LA", "P"):
        img = img.convert("RGBA")
        bg = Image.new("RGB", img.size, (255, 255, 255))
        bg.paste(img, mask=img.split()[-1])
        img = bg
    elif img.mode != "RGB":
        img = img.convert("RGB")
    img.thumbnail((MAX_SIDE, MAX_SIDE))
    name = f"{stem or uuid4().hex}.jpg"
    img.save(upload_dir() / name, "JPEG", quality=86, optimize=True, progressive=True)
    return name


def delete_file(name):
    if not name:
        return
    try:
        (upload_dir() / name).unlink(missing_ok=True)
    except OSError:
        pass


def slugify(text):
    text = unicodedata.normalize("NFKD", text or "").encode("ascii", "ignore").decode()
    text = re.sub(r"[^a-zA-Z0-9]+", "-", text).strip("-").lower()
    return text or uuid4().hex[:8]


def payload():
    data = request.get_json(silent=True)
    if data is None:
        data = request.form.to_dict()
    return data


def get_or_404(model, item_id, label):
    row = db.session.get(model, item_id)
    if row is None:
        raise BadRequest(f"{label} bulunamadı.")
    return row


def set_lang_fields(row, data, prefix):
    for lang in LANGS:
        key = f"{prefix}_{lang}"
        if key in data:
            setattr(row, key, (data.get(key) or "").strip())


# ---------- categories ----------

@admin_bp.post("/categories")
def create_category():
    data = payload()
    cat = Category(sort_order=next_sort_order(Category))
    set_lang_fields(cat, data, "name")
    if not (cat.name_tr or cat.name_en or cat.name_ar):
        raise BadRequest("En az bir dilde kategori adı yazın.")
    base = slugify(data.get("slug") or cat.name_en or cat.name_tr or cat.name_ar)
    slug, i = base, 2
    while Category.query.filter_by(slug=slug).first():
        slug = f"{base}-{i}"
        i += 1
    cat.slug = slug
    db.session.add(cat)
    db.session.commit()
    return jsonify(cat.to_dict()), 201


@admin_bp.put("/categories/<int:cat_id>")
def update_category(cat_id):
    cat = get_or_404(Category, cat_id, "Kategori")
    data = payload()
    set_lang_fields(cat, data, "name")
    if "cover_id" in data:
        raw = data.get("cover_id")
        if raw in (None, "", "null"):
            cat.cover_id = None
        else:
            photo = get_or_404(Photo, int(raw), "Fotoğraf")
            if cat not in photo.categories:
                raise BadRequest("Bu fotoğraf bu kategoride değil.")
            cat.cover_id = photo.id
    db.session.commit()
    return jsonify(cat.to_dict())


@admin_bp.delete("/categories/<int:cat_id>")
def delete_category(cat_id):
    cat = get_or_404(Category, cat_id, "Kategori")
    if cat.photos:
        raise BadRequest("Bu kategoride fotoğraf var. Önce fotoğrafları silin veya başka kategoriye taşıyın.")
    db.session.delete(cat)
    db.session.commit()
    return jsonify(ok=True)


# ---------- photos ----------

def parse_categories(raw_ids):
    """Gelen kategori id listesini doğrular; en az bir geçerli kategori şart."""
    cats = []
    for raw in raw_ids or []:
        try:
            cid = int(raw)
        except (TypeError, ValueError):
            raise BadRequest("Geçersiz kategori.")
        cat = get_or_404(Category, cid, "Kategori")
        if cat not in cats:
            cats.append(cat)
    if not cats:
        raise BadRequest("En az bir kategori seçin.")
    return cats


@admin_bp.post("/photos")
def upload_photos():
    files = request.files.getlist("files")
    if not files:
        raise BadRequest("Fotoğraf seçilmedi.")
    cats = parse_categories(request.form.getlist("category_ids"))
    created = []
    order = next_sort_order(Photo)
    for f in files:
        name = save_image(f)
        photo = Photo(filename=name, categories=list(cats), sort_order=order)
        order += 1
        db.session.add(photo)
        created.append(photo)
    db.session.commit()
    return jsonify([p.to_dict() for p in created]), 201


@admin_bp.put("/photos/<int:photo_id>")
def update_photo(photo_id):
    photo = get_or_404(Photo, photo_id, "Fotoğraf")
    data = payload()
    if "category_ids" in data:
        raw = data["category_ids"]
        raw = raw if isinstance(raw, list) else [raw]
        cats = parse_categories(raw)
        for old in photo.categories:
            if old not in cats and old.cover_id == photo.id:
                old.cover_id = None
        photo.categories = cats
    db.session.commit()
    return jsonify(photo.to_dict())


@admin_bp.delete("/photos/<int:photo_id>")
def delete_photo(photo_id):
    photo = get_or_404(Photo, photo_id, "Fotoğraf")
    for cat in Category.query.filter_by(cover_id=photo.id).all():
        cat.cover_id = None
    delete_file(photo.filename)
    db.session.delete(photo)
    db.session.commit()
    return jsonify(ok=True)


# ---------- branches ----------

def apply_branch_fields(branch, data):
    set_lang_fields(branch, data, "name")
    set_lang_fields(branch, data, "address")
    set_lang_fields(branch, data, "hours")
    if "phone" in data:
        branch.phone = (data.get("phone") or "").strip()
    if "map_query" in data:
        branch.map_query = (data.get("map_query") or "").strip()
    if "map_url" in data:
        branch.map_url = (data.get("map_url") or "").strip()
    elif branch.map_query and (branch.map_query.startswith("http://") or branch.map_query.startswith("https://")):
        branch.map_url = branch.map_query
    file = request.files.get("photo")
    if file and file.filename:
        delete_file(branch.photo)
        branch.photo = save_image(file)
    elif data.get("remove_photo") in ("1", "true", True):
        delete_file(branch.photo)
        branch.photo = None


@admin_bp.post("/branches")
def create_branch():
    data = payload()
    branch = Branch(sort_order=next_sort_order(Branch))
    apply_branch_fields(branch, data)
    if not (branch.name_tr or branch.name_ar or branch.name_en):
        raise BadRequest("En az bir dilde şube adı yazın.")
    db.session.add(branch)
    db.session.commit()
    return jsonify(branch.to_dict()), 201


@admin_bp.put("/branches/<int:branch_id>")
@admin_bp.post("/branches/<int:branch_id>")
def update_branch(branch_id):
    branch = get_or_404(Branch, branch_id, "Şube")
    apply_branch_fields(branch, payload())
    db.session.commit()
    return jsonify(branch.to_dict())


@admin_bp.delete("/branches/<int:branch_id>")
def delete_branch(branch_id):
    branch = get_or_404(Branch, branch_id, "Şube")
    delete_file(branch.photo)
    db.session.delete(branch)
    db.session.commit()
    return jsonify(ok=True)


# ---------- ordering ----------

MODELS = {"categories": Category, "photos": Photo, "branches": Branch}


@admin_bp.post("/reorder")
def reorder():
    data = payload()
    model = MODELS.get(data.get("type"))
    ids = data.get("ids") or []
    if model is None or not isinstance(ids, list):
        raise BadRequest("Geçersiz sıralama isteği.")
    normalize_order(model)
    db.session.flush()
    rows = model.query.filter(model.id.in_(ids)).all()
    by_id = {r.id: r for r in rows}
    slots = sorted(r.sort_order for r in rows)
    for slot, item_id in zip(slots, [i for i in ids if i in by_id]):
        by_id[item_id].sort_order = slot
    db.session.commit()
    return jsonify(ok=True)


# ---------- settings ----------

@admin_bp.put("/settings")
def update_settings():
    data = payload()
    for key in ("phone", "whatsapp", "email", "instagram"):
        if key in data:
            Setting.set(key, (data.get(key) or "").strip())
    for lang in LANGS:
        key = f"ticker_{lang}"
        if key in data:
            lines = [s.strip() for s in (data.get(key) or "").splitlines() if s.strip()]
            Setting.set(key, "\n".join(lines))
    db.session.commit()
    return jsonify(site_payload())


# ---------- hero (ana sayfa kolajı) ----------

def hero_key(slot):
    if slot not in HERO_SLOTS:
        raise BadRequest("Geçersiz alan.")
    return f"hero_{slot}"


@admin_bp.post("/hero/<slot>")
def upload_hero(slot):
    key = hero_key(slot)
    file = request.files.get("file")
    if not file or not file.filename:
        raise BadRequest("Fotoğraf seçilmedi.")
    name = save_image(file)
    delete_file(Setting.get(key))
    Setting.set(key, name)
    db.session.commit()
    return jsonify(site_payload())


@admin_bp.delete("/hero/<slot>")
def clear_hero(slot):
    key = hero_key(slot)
    delete_file(Setting.get(key))
    Setting.set(key, "")
    db.session.commit()
    return jsonify(site_payload())
