# Simplified Gunicorn configuration for initial deployment
# Use this for testing before setting up full logging infrastructure

# Server socket
bind = "0.0.0.0:5000"

# Worker processes
workers = 2
worker_class = "sync"

# Timeout settings
timeout = 30
keepalive = 2

# Application
preload_app = True

# Simple logging (to console)
loglevel = "info"

# Process naming
proc_name = "leettrack" 