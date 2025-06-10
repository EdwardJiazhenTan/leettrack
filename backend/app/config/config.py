import os
from dotenv import load_dotenv
from datetime import timedelta

# Load environment variables from .env file (if exists)
load_dotenv()

class Config:
    """Base configuration class"""
    # Database configuration
    DB_USERNAME = os.environ.get('DB_USERNAME', 'ed')
    DB_PASSWORD = os.environ.get('DB_PASSWORD', 'your_password_here')  # Replace with actual password
    DB_HOST = os.environ.get('DB_HOST', 'database-1.ccri0seewfxp.us-east-1.rds.amazonaws.com')
    DB_PORT = os.environ.get('DB_PORT', '5432')
    DB_NAME = os.environ.get('DB_NAME', 'postgres')
    
    # Build SQLAlchemy database URI
    SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    SQLALCHEMY_TRACK_MODIFICATIONS = False
    
    # Flask application secret key
    SECRET_KEY = os.environ.get('SECRET_KEY', 'dev_key_for_development')
    
    # JWT Configuration
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY', 'jwt_dev_key')
    JWT_ACCESS_TOKEN_EXPIRES = timedelta(hours=1)
    
    # Other global configurations...
    DEBUG = False
    TESTING = False
    
    # External APIs
    LEETCODE_API_BASE_URL = os.environ.get('LEETCODE_API_URL', 'https://alfa-leetcode-api.onrender.com')
    
    # Spaced Repetition Settings
    # Default review intervals in days based on ratings (1-5)
    REVIEW_INTERVALS = {
        1: 1,    # Review again after 1 day
        2: 3,    # Review again after 3 days
        3: 7,    # Review again after 1 week
        4: 14,   # Review again after 2 weeks
        5: 30    # Review again after 1 month
    }


class DevelopmentConfig(Config):
    """Development environment configuration"""
    DEBUG = True


class LocalConfig(Config):
    """Local development configuration with SQLite"""
    DEBUG = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///leettrack_local.db'


class TestingConfig(Config):
    """Testing environment configuration"""
    TESTING = True
    SQLALCHEMY_DATABASE_URI = 'sqlite:///:memory:'


class ProductionConfig(Config):
    """Production environment configuration"""
    # Production-specific configurations


# Configuration dictionary for selecting the correct configuration based on environment variable
config_by_name = {
    'development': DevelopmentConfig,
    'local': LocalConfig,
    'testing': TestingConfig,
    'production': ProductionConfig,
    'default': LocalConfig
}

# Default to development environment configuration
Config = config_by_name[os.environ.get('FLASK_ENV', 'development')] 