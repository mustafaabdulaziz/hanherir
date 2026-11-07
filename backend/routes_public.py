from flask import Blueprint, jsonify

from models import LANGS, Branch, Category, Photo, Setting, photo_url

public_bp = Blueprint("public", __name__, url_prefix="/api")

HERO_SLOTS = ("main", "a", "b")


def hero_payload():
    """Ana sayfa kolajı: her alan için doğrudan yüklenmiş dosyanın adresi (yoksa None)."""
    return {slot: photo_url(Setting.get(f"hero_{slot}")) for slot in HERO_SLOTS}


def ticker_payload():
    """Kayan şerit yazıları: her dil için satır satır liste (boşsa site varsayılanı kullanılır)."""
    out = {}
    for lang in LANGS:
        lines = (Setting.get(f"ticker_{lang}") or "").splitlines()
        out[lang] = [s.strip() for s in lines if s.strip()]
    return out


def site_payload():
    categories = Category.query.order_by(Category.sort_order, Category.id).all()
    photos = Photo.query.order_by(Photo.sort_order, Photo.id).all()
    branches = Branch.query.order_by(Branch.sort_order, Branch.id).all()
    return {
        "categories": [c.to_dict() for c in categories],
        "photos": [p.to_dict() for p in photos],
        "branches": [b.to_dict() for b in branches],
        "contact": Setting.contact(),
        "hero": hero_payload(),
        "ticker": ticker_payload(),
    }


@public_bp.get("/site")
def site():
    return jsonify(site_payload())
