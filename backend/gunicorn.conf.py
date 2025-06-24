# Gunicorn configuration file for LeetTrack backend
# This file configures the WSGI server for production deployment

# Server socket
bind = "0.0.0.0:5000"
backlog = 2048

# Worker processes
workers = 3  # 2 * CPU cores + 1 (adjust based on your EC2 instance)
worker_class = "sync"
worker_connections = 1000
max_requests = 1000
max_requests_jitter = 100

# Timeout settings
timeout = 30
keepalive = 2

# Application
preload_app = True
reload = False

# Logging - Using relative paths that don't require special permissions
accesslog = "logs/access.log"
errorlog = "logs/error.log"
loglevel = "info"
access_log_format = '%(h)s %(l)s %(u)s %(t)s "%(r)s" %(s)s %(b)s "%(f)s" "%(a)s"'

# Process naming
proc_name = "leettrack"

# Server mechanics
daemon = False
pidfile = "leettrack.pid"  # Use relative path
user = "ubuntu"
group = "ubuntu"
tmp_upload_dir = None

# SSL (uncomment if you have SSL certificates)
# keyfile = "/path/to/keyfile"
# certfile = "/path/to/certfile"
