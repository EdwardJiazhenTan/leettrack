from flask import Flask
from flask_sqlalchemy import SQLAlchemy
from flask_migrate import Migrate
from flask_cors import CORS
from flask_jwt_extended import JWTManager
from app.config.config import config_by_name
from datetime import timedelta
import logging
import os

# Configure logging
logging.basicConfig(
    level=logging.INFO, format="%(asctime)s - %(name)s - %(levelname)s - %(message)s"
)

# Initialize extensions without binding to application instance
db = SQLAlchemy()
migrate = Migrate()
jwt = JWTManager()


def create_app(config_name="development"):
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

    # Dynamic CORS configuration based on environment
    if config_name == "production":
        # Production: use environment variable for allowed origins
        cors_origins = (
            os.environ.get("CORS_ORIGINS", "").split(",")
            if os.environ.get("CORS_ORIGINS")
            else []
        )
        # Filter out empty strings
        cors_origins = [origin.strip() for origin in cors_origins if origin.strip()]

        # TEMPORARY: If no CORS_ORIGINS set, allow all (REMOVE IN PRODUCTION!)
        if not cors_origins:
            cors_origins = ["*"]
            print(
                "WARNING: CORS_ORIGINS not set, allowing all origins. This is insecure for production!"
            )
    else:
        # Development: allow localhost
        cors_origins = ["http://localhost:3000"]

    # Configure CORS
    CORS(
        app,
        resources={r"/*": {"origins": cors_origins, "supports_credentials": True}},
        allow_headers=["Content-Type", "Authorization", "X-Requested-With"],
        methods=["GET", "POST", "PUT", "DELETE", "OPTIONS"],
        expose_headers=["Content-Type", "Authorization"],
        max_age=600,
    )

    # Register blueprints
    from app.routes.leetcode_routes import leetcode
    from app.routes.learning_paths_routes import learning_paths_bp
    from app.routes.auth_routes import auth
    from app.routes.debug_routes import debug
    from app.routes.admin_routes import admin
    from app.routes.index import main

    app.register_blueprint(main)
    app.register_blueprint(leetcode)
    app.register_blueprint(learning_paths_bp)
    app.register_blueprint(auth)
    app.register_blueprint(debug)
    app.register_blueprint(admin)

    # JWT error handling
    @jwt.expired_token_loader
    def expired_token_callback(jwt_header, jwt_payload):
        return {"message": "The token has expired", "error": "token_expired"}, 401

    @jwt.invalid_token_loader
    def invalid_token_callback(error):
        return {
            "message": "Signature verification failed",
            "error": "invalid_token",
        }, 401

    @jwt.unauthorized_loader
    def missing_token_callback(error):
        return {
            "message": "Request does not contain an access token",
            "error": "authorization_required",
        }, 401

    # Error handlers
    @app.errorhandler(400)
    def bad_request(error):
        return {"status": "error", "message": "Bad request"}, 400

    @app.errorhandler(404)
    def not_found(error):
        return {"status": "error", "message": "Resource not found"}, 404

    @app.errorhandler(405)
    def method_not_allowed(error):
        return {"status": "error", "message": "Method not allowed"}, 405

    from werkzeug.exceptions import BadRequest

    @app.errorhandler(BadRequest)
    def handle_bad_request(error):
        return {"status": "error", "message": "Invalid JSON format"}, 400

    # Test route
    @app.route("/ping")
    def ping():
        return {"message": "pong"}, 200

    # Create a simple index route
    @app.route("/")
    def index():
        return {"name": "LeetTrack API", "version": "1.0", "status": "active"}

    return app
