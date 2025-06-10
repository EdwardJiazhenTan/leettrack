from functools import wraps
from flask import request, jsonify, g
from flask_jwt_extended import verify_jwt_in_request, get_jwt_identity
from app.models.user import User
import logging

logger = logging.getLogger(__name__)

def auth_required(f):
    """Decorator to protect routes and attach the current user to g"""
    @wraps(f)
    def decorated(*args, **kwargs):
        try:
            # Verify JWT
            verify_jwt_in_request()
            
            # Get user identity
            current_user_id = get_jwt_identity()
            user = User.query.get(current_user_id)
            
            if not user:
                return jsonify({'message': 'User not found'}), 401
            
            # Attach user to g object
            g.user = user
            
            return f(*args, **kwargs)
        except Exception as e:
            logger.error(f"Authentication failed: {str(e)}")
            return jsonify({'message': 'Authentication failed', 'error': str(e)}), 401
    return decorated 