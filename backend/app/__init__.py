from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config.config import config_by_name
from datetime import timedelta
import logging

# Configure logging
logging.basicConfig(
    level=logging.INFO,
    format='%(asctime)s - %(name)s - %(levelname)s - %(message)s'
)

# Initialize extensions without binding to application instance
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()

def create_app(config_name='development'):
    """Application factory function"""
    app = Flask(__name__)
    
    # Load configuration
    app.config.from_object(config_by_name[config_name])
    
    # JWT configuration
    app.config["JWT_SECRET_KEY"] = app.config.get("SECRET_KEY", "dev-key")
    app.config["JWT_ACCESS_TOKEN_EXPIRES"] = timedelta(hours=1)
    app.config["JWT_REFRESH_TOKEN_EXPIRES"] = timedelta(days=30)
    
    # Initialize extensions
    db.init_app(app)
    migrate.init_app(app, db)
    jwt.init_app(app)
    
    # Configure CORS properly to allow all routes
    CORS(app, 
         resources={r"/*": {"origins": ["http://localhost:3000"], "supports_credentials": True}},
         allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
         methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
         expose_headers=["Content-Type", "Authorization"],
         max_age=600)
    
    # Register blueprints
    from app.routes.leetcode_routes import leetcode
    from app.routes.learning_paths_routes import learning_paths_bp
    from app.routes.auth_routes import auth
    from app.routes.debug_routes import debug
    
    app.register_blueprint(leetcode)
    app.register_blueprint(learning_paths_bp)
    app.register_blueprint(auth)
    app.register_blueprint(debug)
    
    # JWT error handling
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {
            'message': 'The token has expired',
            'error': 'token_expired'
        }, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {
            'message': 'Signature verification failed',
            'error': 'invalid_token'
        }, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {
            'message': 'Request does not contain an access token',
            'error': 'authorization_required'
        }, 401
    
    # Test route
    @app.route('/ping')
    def ping():
        return {'message': 'pong'}, 200
    
    # Create a simple index route
    @app.route('/')
    def index():
        return {
            'name': 'LeetTrack API',
            'version': '1.0',
            'status': 'active'
        }
    
    return app 