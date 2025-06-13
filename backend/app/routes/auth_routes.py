from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity
)
from app.models.user import User
from app import db
from passlib.hash import bcrypt
from datetime import datetime
import logging

logger = logging.getLogger(__name__)

auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

@auth.route('/register', methods=['POST'])
def register():
    """Register a new user and return JWT tokens"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['email', 'password', 'leetcode_username']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 409
        
        # Create new user
        password_hash = bcrypt.hash(data['password'])
        new_user = User(
            email=data['email'],
            password_hash=password_hash,
            leetcode_username=data['leetcode_username'],
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(new_user.user_id))
        refresh_token = create_refresh_token(identity=str(new_user.user_id))
        
        return jsonify({
            'message': 'Registration successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': new_user.user_id,
                'email': new_user.email,
                'leetcode_username': new_user.leetcode_username,
                'is_admin': new_user.is_admin
            }
        }), 201
    
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'An error occurred during registration'}), 500

@auth.route('/login', methods=['POST'])
def login():
    """Authenticate a user and return JWT tokens"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        if not user or not bcrypt.verify(data['password'], user.password_hash):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Update last login time
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.user_id))
        refresh_token = create_refresh_token(identity=str(user.user_id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.user_id,
                'email': user.email,
                'leetcode_username': user.leetcode_username,
                'is_admin': user.is_admin
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({'message': 'An error occurred during login'}), 500

@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Generate a new access token using a refresh token"""
    try:
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': access_token
        }), 200
    
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        return jsonify({'message': 'An error occurred while refreshing token'}), 500

@auth.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get the current user's profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'id': user.user_id,
            'email': user.email,
            'leetcode_username': user.leetcode_username,
            'is_admin': user.is_admin,
            'created_at': user.created_at,
            'last_login': user.last_login
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        return jsonify({'message': 'An error occurred while getting user profile'}), 500 