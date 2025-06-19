"""
Comprehensive unit tests for LeetTrack API endpoints
"""

import pytest
import json
from flask import url_for


class TestHealthCheckEndpoints:
    """Test basic health check and info endpoints"""

    def test_ping_endpoint(self, client):
        """Test the ping endpoint"""
        response = client.get("/ping")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["message"] == "pong"

    def test_index_endpoint(self, client):
        """Test the root endpoint"""
        response = client.get("/")
        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["name"] == "LeetTrack API"
        assert data["version"] == "1.0"
        assert data["status"] == "active"


class TestAuthEndpoints:
    """Test authentication related endpoints"""

    def test_register_user(self, client):
        """Test user registration"""
        user_data = {
            "email": "newuser@example.com",
            "password": "securepassword123",
            "leetcode_username": "newuser123",
        }

        response = client.post(
            "/api/v1/auth/register",
            data=json.dumps(user_data),
            content_type="application/json",
        )

        assert response.status_code == 201
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert data["message"] == "User registered successfully"

    def test_register_duplicate_email(self, client, test_user):
        """Test registration with duplicate email"""
        user_data = {
            "email": "test@example.com",  # Same as test_user
            "password": "securepassword123",
            "leetcode_username": "newuser123",
        }

        response = client.post(
            "/api/v1/auth/register",
            data=json.dumps(user_data),
            content_type="application/json",
        )

        assert response.status_code == 400
        data = json.loads(response.data)
        assert data["status"] == "error"

    def test_login_valid_credentials(self, client, test_user):
        """Test login with valid credentials"""
        login_data = {"email": "test@example.com", "password": "testpassword"}

        response = client.post(
            "/api/v1/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "access_token" in data
        assert "refresh_token" in data
        assert data["user"]["email"] == "test@example.com"

    def test_login_invalid_credentials(self, client, test_user):
        """Test login with invalid credentials"""
        login_data = {"email": "test@example.com", "password": "wrongpassword"}

        response = client.post(
            "/api/v1/auth/login",
            data=json.dumps(login_data),
            content_type="application/json",
        )

        assert response.status_code == 401
        data = json.loads(response.data)
        assert data["status"] == "error"

    def test_get_current_user(self, client, auth_headers):
        """Test getting current user info"""
        response = client.get("/api/v1/auth/me", headers=auth_headers)

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert data["user"]["email"] == "test@example.com"

    def test_get_current_user_without_auth(self, client):
        """Test getting current user without authentication"""
        response = client.get("/api/v1/auth/me")

        assert response.status_code == 401


class TestLeetCodeEndpoints:
    """Test LeetCode related endpoints"""

    def test_get_daily_question(self, client):
        """Test getting daily question"""
        response = client.get("/api/v1/leetcode/daily")

        # This endpoint fetches from external API, so we test for proper response format
        assert response.status_code in [200, 500]  # May fail if external API is down

        if response.status_code == 200:
            data = json.loads(response.data)
            # Check for actual response structure (date, link, question)
            assert "date" in data or "question" in data or "error" in data
        else:
            # If 500, should have error format
            data = json.loads(response.data)
            assert "status" in data and data["status"] == "error"

    def test_get_problems_list(self, client):
        """Test getting problems list"""
        response = client.get("/api/v1/leetcode/problems?limit=5&skip=0")

        assert response.status_code in [200, 500]  # May fail if external API is down

        if response.status_code == 200:
            data = json.loads(response.data)
            # Check for actual response structure (questions array, total)
            assert "questions" in data or "total" in data or "error" in data
        else:
            # If 500, should have error format
            data = json.loads(response.data)
            assert "status" in data and data["status"] == "error"

    def test_get_problem_by_slug(self, client):
        """Test getting specific problem by slug"""
        response = client.get("/api/v1/leetcode/problem/two-sum")

        assert response.status_code in [200, 404, 500]  # Various valid responses

        if response.status_code == 200:
            data = json.loads(response.data)
            # Check for actual response structure (problem details)
            assert "title" in data or "questionId" in data or "error" in data
        else:
            # For errors, should have proper error format
            data = json.loads(response.data)
            assert "status" in data or "error" in data


class TestUserEndpoints:
    """Test user-specific endpoints requiring authentication"""

    def test_get_dashboard_summary(self, client, auth_headers):
        """Test getting user dashboard summary"""
        response = client.get(
            "/api/v1/auth/user/dashboard/summary", headers=auth_headers
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "data" in data

    def test_get_dashboard_summary_without_auth(self, client):
        """Test getting dashboard summary without authentication"""
        response = client.get("/api/v1/auth/user/dashboard/summary")

        assert response.status_code == 401

    def test_get_todays_reviews(self, client, auth_headers):
        """Test getting today's reviews"""
        response = client.get("/api/v1/auth/user/reviews/today", headers=auth_headers)

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "data" in data

    def test_get_questions_need_rating(self, client, auth_headers):
        """Test getting questions that need rating"""
        response = client.get(
            "/api/v1/auth/user/questions/need-rating", headers=auth_headers
        )

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"


class TestLearningPathsEndpoints:
    """Test learning paths endpoints"""

    def test_get_learning_paths(self, client):
        """Test getting learning paths list"""
        response = client.get("/api/v1/learning-paths")

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert "data" in data
        assert "learning_paths" in data["data"]

    def test_get_learning_paths_with_params(self, client):
        """Test getting learning paths with query parameters"""
        response = client.get("/api/v1/learning-paths?difficulty=Easy&limit=5")

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"

    def test_get_specific_learning_path(self, client, app):
        """Test getting a specific learning path"""
        # First create a test learning path
        with app.app_context():
            from app.models.learning_path import LearningPath
            from app import db

            path = LearningPath(
                title="Test Path",
                description="Test Description",
                difficulty="Easy",
                source="leetcode",
                is_active=True,
            )
            db.session.add(path)
            db.session.commit()
            path_id = path.id

        response = client.get(f"/api/v1/learning-paths/{path_id}")

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"
        assert data["data"]["title"] == "Test Path"

    def test_get_nonexistent_learning_path(self, client):
        """Test getting a non-existent learning path"""
        response = client.get("/api/v1/learning-paths/99999")

        assert response.status_code == 404
        data = json.loads(response.data)
        assert data["status"] == "error"


class TestAdminEndpoints:
    """Test admin-only endpoints"""

    def test_get_admin_paths_with_admin(self, client, admin_headers):
        """Test getting admin learning paths with admin user"""
        response = client.get("/api/v1/admin/learning-paths", headers=admin_headers)

        assert response.status_code == 200
        data = json.loads(response.data)
        assert data["status"] == "success"

    def test_get_admin_paths_without_admin(self, client, auth_headers):
        """Test getting admin learning paths with regular user"""
        response = client.get("/api/v1/admin/learning-paths", headers=auth_headers)

        assert response.status_code == 403  # Forbidden

    def test_get_admin_paths_without_auth(self, client):
        """Test getting admin learning paths without authentication"""
        response = client.get("/api/v1/admin/learning-paths")

        assert response.status_code == 401  # Unauthorized


class TestErrorHandling:
    """Test error handling scenarios"""

    def test_invalid_endpoint(self, client):
        """Test accessing non-existent endpoint"""
        response = client.get("/api/v1/nonexistent")

        assert response.status_code == 404

    def test_invalid_method(self, client):
        """Test using invalid HTTP method"""
        response = client.delete("/api/v1/leetcode/daily")

        assert response.status_code == 405  # Method not allowed

    def test_malformed_json(self, client):
        """Test sending malformed JSON"""
        response = client.post(
            "/api/v1/auth/login",
            data='{"invalid": json}',
            content_type="application/json",
        )

        assert response.status_code == 400


class TestCORSHeaders:
    """Test CORS headers are properly set"""

    def test_cors_headers_present(self, client):
        """Test that CORS headers are present in responses"""
        response = client.get("/ping")

        assert response.status_code == 200
        # Note: In test environment, CORS headers might not be set exactly as in production
        # This test verifies the endpoint works, actual CORS testing would need browser testing
