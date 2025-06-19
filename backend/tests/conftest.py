import pytest
import os
import tempfile
from app import create_app, db
from app.models.user import User
from app.models.learning_path import LearningPath
from app.models.user_question import UserQuestion
from flask_jwt_extended import create_access_token


@pytest.fixture
def app():
    """Create and configure a new app instance for each test."""
    # Create a temporary file to use as the database
    db_fd, db_path = tempfile.mkstemp()

    # Set test configuration
    test_config = {
        "TESTING": True,
        "SQLALCHEMY_DATABASE_URI": f"sqlite:///{db_path}",
        "JWT_SECRET_KEY": "test-secret",
        "WTF_CSRF_ENABLED": False,
        "SECRET_KEY": "test-secret-key",
    }

    # Create app with test config
    app = create_app("testing")
    app.config.update(test_config)

    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()

    # Clean up temporary file
    os.close(db_fd)
    os.unlink(db_path)


@pytest.fixture
def client(app):
    """A test client for the app."""
    return app.test_client()


@pytest.fixture
def runner(app):
    """A test runner for the app's Click commands."""
    return app.test_cli_runner()


@pytest.fixture
def test_user(app):
    """Create a test user."""
    with app.app_context():
        user = User(email="test@example.com", leetcode_username="testuser")
        user.set_password("testpassword")
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def admin_user(app):
    """Create an admin test user."""
    with app.app_context():
        user = User(
            email="admin@example.com", leetcode_username="adminuser", is_admin=True
        )
        user.set_password("adminpassword")
        db.session.add(user)
        db.session.commit()
        return user


@pytest.fixture
def auth_headers(app, test_user):
    """Create authorization headers for authenticated requests."""
    with app.app_context():
        access_token = create_access_token(identity=test_user.id)
        return {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }


@pytest.fixture
def admin_headers(app, admin_user):
    """Create authorization headers for admin requests."""
    with app.app_context():
        access_token = create_access_token(identity=admin_user.id)
        return {
            "Authorization": f"Bearer {access_token}",
            "Content-Type": "application/json",
        }
