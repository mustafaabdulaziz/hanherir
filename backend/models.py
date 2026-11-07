import re
from datetime import datetime

from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

LANGS = ("ar", "tr", "en")


def photo_url(filename):
    return f"/uploads/{filename}" if filename else None


def tel_digits(phone):
    digits = re.sub(r"\D", "", phone or "")
    return f"+{digits}" if digits else ""


class Setting(db.Model):
    __tablename__ = "settings"
    key = db.Column(db.String(64), primary_key=True)
    value = db.Column(db.Text, default="")

    @staticmethod
    def get(key, default=""):
        row = db.session.get(Setting, key)
        return row.value if row and row.value is not None else default

    @staticmethod
    def set(key, value):
        row = db.session.get(Setting, key)
        if row is None:
            row = Setting(key=key)
            db.session.add(row)
        row.value = "" if value is None else str(value)

    @staticmethod
    def contact():
        phone = Setting.get("phone")
        wa = re.sub(r"\D", "", Setting.get("whatsapp") or phone)
        return {
            "phone": phone,
            "phoneTel": tel_digits(phone),
            "whatsapp": wa,
            "email": Setting.get("email"),
            "instagram": Setting.get("instagram"),
        }


# Bir fotoğraf birden fazla kategoride olabilir (çoktan çoğa ilişki).
photo_categories = db.Table(
    "photo_categories",
    db.Column("photo_id", db.Integer, db.ForeignKey("photos.id"), primary_key=True),
    db.Column("category_id", db.Integer, db.ForeignKey("categories.id"), primary_key=True),
)


class Category(db.Model):
    __tablename__ = "categories"
    id = db.Column(db.Integer, primary_key=True)
    slug = db.Column(db.String(64), unique=True, nullable=False)
    name_ar = db.Column(db.String(120), default="")
    name_tr = db.Column(db.String(120), default="")
    name_en = db.Column(db.String(120), default="")
    cover_id = db.Column(db.Integer, nullable=True)
    sort_order = db.Column(db.Integer, default=0)

    photos = db.relationship(
        "Photo",
        secondary=photo_categories,
        back_populates="categories",
        order_by="Photo.sort_order, Photo.id",
    )

    def cover_photo(self):
        if self.cover_id:
            p = db.session.get(Photo, self.cover_id)
            if p and self in p.categories:
                return p
        return self.photos[0] if self.photos else None

    def to_dict(self):
        cover = self.cover_photo()
        return {
            "id": self.id,
            "slug": self.slug,
            "name": {"ar": self.name_ar, "tr": self.name_tr, "en": self.name_en},
            "cover": photo_url(cover.filename) if cover else None,
            "cover_id": cover.id if cover else None,
            "count": len(self.photos),
            "sort_order": self.sort_order,
        }


class Photo(db.Model):
    __tablename__ = "photos"
    id = db.Column(db.Integer, primary_key=True)
    filename = db.Column(db.String(200), nullable=False)
    sort_order = db.Column(db.Integer, default=0)
    created_at = db.Column(db.DateTime, default=datetime.utcnow)

    categories = db.relationship(
        "Category",
        secondary=photo_categories,
        back_populates="photos",
        order_by="Category.sort_order, Category.id",
    )

    def to_dict(self):
        return {
            "id": self.id,
            "url": photo_url(self.filename),
            "category_ids": [c.id for c in self.categories],
            "sort_order": self.sort_order,
        }


class Branch(db.Model):
    __tablename__ = "branches"
    id = db.Column(db.Integer, primary_key=True)
    name_ar = db.Column(db.String(120), default="")
    name_tr = db.Column(db.String(120), default="")
    name_en = db.Column(db.String(120), default="")
    address_ar = db.Column(db.String(300), default="")
    address_tr = db.Column(db.String(300), default="")
    address_en = db.Column(db.String(300), default="")
    hours_ar = db.Column(db.String(120), default="")
    hours_tr = db.Column(db.String(120), default="")
    hours_en = db.Column(db.String(120), default="")
    phone = db.Column(db.String(40), default="")
    map_query = db.Column(db.String(300), default="")
    map_url = db.Column(db.String(1000), default="")
    photo = db.Column(db.String(200), nullable=True)
    sort_order = db.Column(db.Integer, default=0)

    def to_dict(self):
        return {
            "id": self.id,
            "name": {"ar": self.name_ar, "tr": self.name_tr, "en": self.name_en},
            "address": {"ar": self.address_ar, "tr": self.address_tr, "en": self.address_en},
            "hours": {"ar": self.hours_ar, "tr": self.hours_tr, "en": self.hours_en},
            "phone": self.phone,
            "phoneTel": tel_digits(self.phone),
            "map": self.map_query or self.address_tr or self.address_en,
            "map_url": self.map_url or "",
            "photo": photo_url(self.photo),
            "sort_order": self.sort_order,
        }


def next_sort_order(model):
    current = db.session.query(db.func.max(model.sort_order)).scalar()
    return 0 if current is None else current + 1


def normalize_order(model):
    rows = model.query.order_by(model.sort_order, model.id).all()
    for i, row in enumerate(rows):
        row.sort_order = i
    return rows
