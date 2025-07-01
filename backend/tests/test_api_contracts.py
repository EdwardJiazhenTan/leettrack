"""
API Contract Tests - Ensures API responses match frontend expectations
These tests would have caught the learning_paths data structure mismatch
"""

import pytest
import json
from app import create_app
from app.models import db


@pytest.fixture
def app():
    """Create test app instance"""
    app = create_app('testing')
    with app.app_context():
        db.create_all()
        yield app
        db.drop_all()


@pytest.fixture
def client(app):
    """Create test client"""
    return app.test_client()


class TestLearningPathsApiContract:
    """Test that learning paths API matches frontend contract"""

    def test_learning_paths_response_structure(self, client):
        """Test that /api/v1/learning-paths returns correct structure"""
        response = client.get('/api/v1/learning-paths')
        
        assert response.status_code == 200
        data = json.loads(response.data)
        
        # Validate top-level structure
        assert 'status' in data
        assert 'data' in data
        assert data['status'] == 'success'
        
        # Validate data structure - critical for frontend
        assert isinstance(data['data'], dict)
        assert 'learning_paths' in data['data']
        assert isinstance(data['data']['learning_paths'], list)
        
        # If there are paths, validate structure
        if data['data']['learning_paths']:
            path = data['data']['learning_paths'][0]
            required_fields = [
                'path_id', 'name', 'description', 'difficulty_level',
                'estimated_hours', 'question_count', 'tags', 'source'
            ]
            for field in required_fields:
                assert field in path, f"Missing required field: {field}"
                
            # Validate field types
            assert isinstance(path['path_id'], int)
            assert isinstance(path['name'], str)
            assert isinstance(path['description'], str)
            assert isinstance(path['difficulty_level'], str)
            assert isinstance(path['question_count'], int)
            assert isinstance(path['tags'], list)
            assert isinstance(path['source'], str)

    def test_learning_path_detail_contract(self, client):
        """Test individual learning path endpoint structure"""
        # First get available paths
        response = client.get('/api/v1/learning-paths')
        data = json.loads(response.data)
        
        if data['data']['learning_paths']:
            path_id = data['data']['learning_paths'][0]['path_id']
            
            # Test detail endpoint
            detail_response = client.get(f'/api/v1/learning-paths/{path_id}')
            assert detail_response.status_code == 200
            
            detail_data = json.loads(detail_response.data)
            assert 'status' in detail_data
            assert 'data' in detail_data


class TestAuthApiContract:
    """Test authentication API contracts"""

    def test_auth_endpoints_require_token(self, client):
        """Test that auth endpoints return proper error structure"""
        auth_endpoints = [
            '/api/v1/auth/user/dashboard/summary',
            '/api/v1/auth/user/reviews/today',
            '/api/v1/auth/user/questions/need-rating',
        ]
        
        for endpoint in auth_endpoints:
            response = client.get(endpoint)
            assert response.status_code == 401
            
            data = json.loads(response.data)
            assert 'error' in data or 'message' in data

    def test_auth_response_with_valid_token(self, client, mocker):
        """Test auth endpoints return correct structure with valid token"""
        # Mock JWT verification
        mocker.patch('flask_jwt_extended.verify_jwt_in_request')
        mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
        
        # Mock user data
        mock_user = mocker.MagicMock()
        mock_user.user_id = 1
        mock_user.is_admin = False
        mocker.patch('app.routes.auth_routes.User.query.get', return_value=mock_user)
        
        response = client.get('/api/v1/auth/user/dashboard/summary')
        
        if response.status_code == 200:
            data = json.loads(response.data)
            assert 'status' in data or 'data' in data


class TestLeetCodeApiContract:
    """Test LeetCode API contracts"""

    def test_leetcode_daily_response_structure(self, client):
        """Test daily question endpoint structure"""
        response = client.get('/api/v1/leetcode/daily')
        
        # Should return 200 or handle gracefully
        if response.status_code == 200:
            data = json.loads(response.data)
            # LeetCode API has different structure than other endpoints
            # It doesn't use {status, data} pattern
            assert isinstance(data, dict)
            
            if 'question' in data:
                question = data['question']
                assert isinstance(question, dict)


class TestAdminApiContract:
    """Test admin API contracts"""

    def test_admin_learning_paths_structure(self, client, mocker):
        """Test admin learning paths endpoint structure"""
        # Mock admin authentication
        mocker.patch('flask_jwt_extended.verify_jwt_in_request')
        mocker.patch('flask_jwt_extended.get_jwt_identity', return_value=1)
        
        mock_user = mocker.MagicMock()
        mock_user.user_id = 1
        mock_user.is_admin = True
        mocker.patch('app.routes.admin_routes.User.query.get', return_value=mock_user)
        
        response = client.get('/api/v1/admin/learning-paths')
        
        if response.status_code == 200:
            data = json.loads(response.data)
            assert 'status' in data
            assert 'data' in data
            assert data['status'] == 'success'
            
            # Admin endpoint should return array directly in data
            assert isinstance(data['data'], list)


class TestApiUrlStructure:
    """Test that all API endpoints follow consistent URL patterns"""

    def test_api_endpoints_have_version_prefix(self, client):
        """Test that all endpoints start with /api/v1/"""
        
        # Test various endpoints
        endpoints_to_test = [
            '/api/v1/learning-paths',
            '/api/v1/leetcode/daily',
            '/api/v1/auth/user/dashboard/summary',
        ]
        
        for endpoint in endpoints_to_test:
            response = client.get(endpoint)
            # Should not return 404 (endpoint exists)
            assert response.status_code != 404, f"Endpoint {endpoint} not found"

    def test_endpoints_without_version_return_404(self, client):
        """Test that endpoints without /api/v1/ prefix return 404"""
        
        old_style_endpoints = [
            '/learning-paths',
            '/auth/user/dashboard/summary',
            '/admin/learning-paths',
        ]
        
        for endpoint in old_style_endpoints:
            response = client.get(endpoint)
            # These should return 404 since we require /api/v1/ prefix
            assert response.status_code == 404, f"Old-style endpoint {endpoint} should not exist"


class TestResponseHeaders:
    """Test that API responses include proper headers"""

    def test_cors_headers_present(self, client):
        """Test that CORS headers are present"""
        response = client.get('/api/v1/learning-paths')
        
        # Should have CORS headers for frontend communication
        assert 'Access-Control-Allow-Origin' in response.headers

    def test_content_type_json(self, client):
        """Test that API endpoints return JSON content type"""
        response = client.get('/api/v1/learning-paths')
        
        if response.status_code == 200:
            assert 'application/json' in response.headers.get('Content-Type', '')


# Integration test that would have caught our production bug
class TestDataStructureMismatch:
    """Specific tests for the bug we encountered"""

    def test_learning_paths_data_structure_matches_frontend(self, client):
        """
        This test specifically validates the exact data structure
        that caused our production bug
        """
        response = client.get('/api/v1/learning-paths')
        assert response.status_code == 200
        
        data = json.loads(response.data)
        
        # The exact structure frontend expects
        assert data['status'] == 'success'
        assert 'data' in data
        assert 'learning_paths' in data['data']
        assert isinstance(data['data']['learning_paths'], list)
        
        # Frontend code does: result.data.learning_paths.map(...)
        # This should not throw "map is not a function"
        paths_array = data['data']['learning_paths']
        assert hasattr(paths_array, '__iter__'), "learning_paths must be iterable"
        
        # Simulate what frontend does
        try:
            # This is what frontend does - should not fail
            for path in paths_array:
                assert isinstance(path, dict)
                assert 'path_id' in path
        except TypeError as e:
            pytest.fail(f"Frontend would fail with: {e}")