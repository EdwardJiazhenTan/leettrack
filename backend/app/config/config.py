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
    
    # Spaced Repetition Settings - Legacy
    # Default review intervals in days based on ratings (1-5)
    REVIEW_INTERVALS = {
        1: 1,    # Review again after 1 day
        2: 3,    # Review again after 3 days
        3: 7,    # Review again after 1 week
        4: 14,   # Review again after 2 weeks
        5: 30    # Review again after 1 month
    }
    
    # New Descriptive Review Confidence System
    REVIEW_CONFIDENCE_LEVELS = [
        {
            'value': 'mastered',
            'label': 'Mastered',
            'description': "Don't need to review - came up with optimal solution immediately",
            'color': '#10b981',  # green-500
            'intervals': []  # No more reviews
        },
        {
            'value': 'confident', 
            'label': 'Confident',
            'description': 'Came up with best solution quickly',
            'color': '#3b82f6',  # blue-500
            'intervals': [7, 21, 60]
        },
        {
            'value': 'understood',
            'label': 'Understood', 
            'description': 'Solved but could use better/faster solution',
            'color': '#f59e0b',  # amber-500
            'intervals': [3, 7, 21]
        },
        {
            'value': 'struggled',
            'label': 'Struggled',
            'description': "Didn't solve in time, but understand the solution",
            'color': '#ef4444',  # red-500
            'intervals': [1, 3, 7, 14, 30]
        },
        {
            'value': 'confused',
            'label': 'Confused',
            'description': "Don't understand the solution, need multiple reviews",
            'color': '#8b5cf6',  # violet-500
            'intervals': [1, 3, 7, 14, 30]
        }
    ]
    
    # Daily Study Settings
    NEW_QUESTIONS_PER_DAY = 1  # Default new questions per day (will be user configurable later)


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
    DEBUG = False
    TESTING = False
    
    # Production security - these MUST be set via environment variables
    SECRET_KEY = os.environ.get('SECRET_KEY')
    JWT_SECRET_KEY = os.environ.get('JWT_SECRET_KEY')
    
    # Database configuration - prefer DATABASE_URL, fall back to individual components
    if os.environ.get('DATABASE_URL'):
        SQLALCHEMY_DATABASE_URI = os.environ.get('DATABASE_URL')
    else:
        # Fall back to individual database components (inherited from base Config)
        DB_USERNAME = os.environ.get('DB_USERNAME', 'ed')
        DB_PASSWORD = os.environ.get('DB_PASSWORD', 'your_password_here')
        DB_HOST = os.environ.get('DB_HOST', 'database-1.ccri0seewfxp.us-east-1.rds.amazonaws.com')
        DB_PORT = os.environ.get('DB_PORT', '5432')
        DB_NAME = os.environ.get('DB_NAME', 'postgres')
        SQLALCHEMY_DATABASE_URI = f"postgresql://{DB_USERNAME}:{DB_PASSWORD}@{DB_HOST}:{DB_PORT}/{DB_NAME}"
    
    # Production logging
    LOG_LEVEL = 'INFO'
    
    # CORS origins for production (comma-separated list)
    CORS_ORIGINS = os.environ.get('CORS_ORIGINS', '').split(',') if os.environ.get('CORS_ORIGINS') else []


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