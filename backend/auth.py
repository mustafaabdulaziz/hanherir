import hmac
import os
import time
from functools import wraps

from flask import Blueprint, jsonify, request, session

auth_bp = Blueprint("auth", __name__, url_prefix="/api/auth")

_failed = {}  # ip -> (count, last_time)


def admin_password():
    return os.environ.get("ADMIN_PASSWORD", "")


def require_admin_password():
    """Uygulama açılırken şifre .env içinde tanımlı mı diye bakar."""
    if len(admin_password()) < 6:
        raise RuntimeError(
            "ADMIN_PASSWORD tanımlı değil veya çok kısa (en az 6 karakter). "
            "backend/.env dosyasına ADMIN_PASSWORD=... satırını ekleyin "
            "(örnek için backend/.env.example dosyasına bakın)."
        )


def login_required(fn):
    @wraps(fn)
    def wrapper(*args, **kwargs):
        if not session.get("admin"):
            return jsonify(error="Giriş gerekli"), 401
        return fn(*args, **kwargs)

    return wrapper


def _throttled(ip):
    count, last = _failed.get(ip, (0, 0))
    if count >= 5 and time.time() - last < 60:
        return True
    return False


@auth_bp.post("/login")
def login():
    ip = request.remote_addr or "?"
    if _throttled(ip):
        return jsonify(error="Çok fazla deneme. Bir dakika bekleyin."), 429
    data = request.get_json(silent=True) or {}
    password = data.get("password", "")
    if (
        isinstance(password, str)
        and password
        and hmac.compare_digest(password.encode("utf-8"), admin_password().encode("utf-8"))
    ):
        _failed.pop(ip, None)
        session.clear()
        session["admin"] = True
        session.permanent = True
        return jsonify(ok=True)
    count, _ = _failed.get(ip, (0, 0))
    _failed[ip] = (count + 1, time.time())
    return jsonify(error="Şifre yanlış"), 401


@auth_bp.post("/logout")
def logout():
    session.clear()
    return jsonify(ok=True)


@auth_bp.get("/me")
def me():
    return jsonify(authenticated=bool(session.get("admin")))
