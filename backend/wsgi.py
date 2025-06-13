#!/usr/bin/env python3
"""
WSGI entry point for production deployment
"""
import os
from app import create_app

# Create application instance for production
app = create_app('production')

if __name__ == "__main__":
    # This is only used for development testing
    # In production, Gunicorn will import the 'app' object directly
    app.run(host='0.0.0.0', port=5000) 