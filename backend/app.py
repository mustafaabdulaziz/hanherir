import os
import secrets
from datetime import timedelta
from pathlib import Path

from dotenv import load_dotenv
from flask import Flask, abort, jsonify, send_from_directory
from werkzeug.middleware.proxy_fix import ProxyFix

from auth import auth_bp, require_admin_password
from models import db
from routes_admin import admin_bp
from routes_public import public_bp

BASE = Path(__file__).resolve().parent
ROOT = BASE.parent
load_dotenv(BASE / ".env")
UPLOADS = BASE / "uploads"
INSTANCE = BASE / "instance"
DIST = ROOT / "frontend" / "dist"


def load_secret_key():
    env = os.environ.get("SECRET_KEY")
    if env:
        return env
    path = INSTANCE / "secret_key"
    if not path.exists():
        path.write_text(secrets.token_hex(32))
    return path.read_text().strip()


def create_app():
    require_admin_password()
    INSTANCE.mkdir(exist_ok=True)
    UPLOADS.mkdir(exist_ok=True)

    app = Flask(__name__, static_folder=None)
    # Nginx arkasında gerçek istemci IP'sini / https şemasını doğru al.
    app.wsgi_app = ProxyFix(app.wsgi_app, x_for=1, x_proto=1, x_host=1)
    app.config.update(
        SECRET_KEY=load_secret_key(),
        SQLALCHEMY_DATABASE_URI="sqlite:///" + (INSTANCE / "site.db").as_posix(),
        SQLALCHEMY_TRACK_MODIFICATIONS=False,
        MAX_CONTENT_LENGTH=60 * 1024 * 1024,
        UPLOAD_DIR=str(UPLOADS),
        SESSION_COOKIE_HTTPONLY=True,
        SESSION_COOKIE_SAMESITE="Lax",
        # Canlıda (HTTPS) varsayılan açık. Yerelde http ile denemek için .env içine COOKIE_SECURE=0 yazın.
        SESSION_COOKIE_SECURE=os.environ.get("COOKIE_SECURE", "1") != "0",
        PERMANENT_SESSION_LIFETIME=timedelta(days=14),
        JSON_SORT_KEYS=False,
    )

    db.init_app(app)
    with app.app_context():
        db.create_all()
        try:
            with db.engine.connect() as conn:
                cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(branches)").fetchall()]
                if "map_url" not in cols:
                    conn.exec_driver_sql("ALTER TABLE branches ADD COLUMN map_url VARCHAR(1000) DEFAULT ''")
                    conn.commit()
        except Exception as e:
            app.logger.warning("Migration warning: %s", e)
        try:
            # Eski tek-kategori yapısından (photos.category_id) çoktan çoğa yapıya geçiş.
            with db.engine.connect() as conn:
                cols = [row[1] for row in conn.exec_driver_sql("PRAGMA table_info(photos)").fetchall()]
                if "category_id" in cols:
                    conn.exec_driver_sql(
                        "INSERT OR IGNORE INTO photo_categories (photo_id, category_id) "
                        "SELECT id, category_id FROM photos WHERE category_id IS NOT NULL"
                    )
                    conn.exec_driver_sql("UPDATE photos SET category_id = NULL WHERE category_id IS NOT NULL")
                    conn.commit()
        except Exception as e:
            app.logger.warning("Migration warning (photo_categories): %s", e)

    app.register_blueprint(auth_bp)
    app.register_blueprint(public_bp)
    app.register_blueprint(admin_bp)

    @app.errorhandler(413)
    def too_large(_e):
        return jsonify(error="Dosya çok büyük (en fazla 60 MB)."), 413

    @app.errorhandler(404)
    def not_found(_e):
        return jsonify(error="Bulunamadı"), 404

    @app.route("/uploads/<path:name>")
    def uploads(name):
        return send_from_directory(UPLOADS, name, max_age=60 * 60 * 24 * 30)

    @app.route("/", defaults={"path": ""})
    @app.route("/<path:path>")
    def spa(path):
        if path.startswith("api/") or path.startswith("uploads/"):
            abort(404)
        if path and (DIST / path).is_file():
            return send_from_directory(DIST, path)
        if not (DIST / "index.html").exists():
            return (
                "Arayüz henüz derlenmemiş. Terminalde: cd frontend && npm install && npm run build",
                503,
            )
        return send_from_directory(DIST, "index.html")

    return app


app = create_app()

if __name__ == "__main__":
    port = int(os.environ.get("PORT", "5000"))
    app.run(host="127.0.0.1", port=port, debug=os.environ.get("FLASK_DEBUG") == "1")
