from functools import wraps
from flask_jwt_extended import jwt_required, get_jwt_identity
from flask import jsonify

from app.models.user import User


def admin_required(fn):
    """Decorator to ensure the current user is an admin."""

    @wraps(fn)
    @jwt_required()
    def wrapper(*args, **kwargs):
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        if not user or not user.is_admin:
            return jsonify({"message": "Admin privileges required"}), 403
        return fn(*args, **kwargs)

    return wrapper 