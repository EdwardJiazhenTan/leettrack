from flask import Blueprint, jsonify
from app import db
from app.models.user import User

# Create blueprint
main = Blueprint('main', __name__)

@main.route('/')
def index():
    return jsonify({
        'message': 'Welcome to LeetTrack API',
        'version': '1.0.0'
    })

@main.route('/api/health')
def health_check():
    """Health check endpoint for CI/CD and monitoring"""
    try:
        # Test database connection
        db.session.execute('SELECT 1')
        db_status = 'healthy'
    except Exception as e:
        db_status = f'unhealthy: {str(e)}'
    
    return jsonify({
        'status': 'healthy',
        'message': 'LeetTrack API is running',
        'database': db_status,
        'version': '1.0.0'
    })

@main.route('/db-test')
def db_test():
    """Test database connection"""
    try:
        # Execute a simple query
        user_count = User.query.count()
        return jsonify({
            'status': 'success',
            'message': 'Database connection successful',
            'user_count': user_count
        })
    except Exception as e:
        return jsonify({
            'status': 'error',
            'message': 'Database connection failed',
            'error': str(e)
        }), 500 