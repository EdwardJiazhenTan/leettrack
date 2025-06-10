import os
from app import create_app, db
from flask_migrate import Migrate

# Get configuration from environment variable
config_name = os.environ.get('FLASK_ENV', 'development')
app = create_app(config_name)
migrate = Migrate(app, db)

if __name__ == '__main__':
    app.run(debug=True) 