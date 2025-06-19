#!/usr/bin/env python3
"""
WSGI entry point for production deployment
"""
import os
from app import create_app

# Create application instance for production
app = create_app("production")

if __name__ == "__main__":
    # This is only used for development testing
    # In production, Gunicorn will import the 'app' object directly
    
    # Get environment and configure accordingly
    env = os.environ.get("FLASK_ENV", "production")
    
    if env == "development":
        # Development: allow all interfaces and enable debug
        app.run(host="0.0.0.0", port=5000, debug=True)  # nosec B201,B104
    else:
        # Production/Testing: bind to localhost only, no debug
        app.run(host="127.0.0.1", port=5000, debug=False)
