#!/usr/bin/env python3
"""
Live API endpoint tests for LeetTrack backend
Tests the actual API running on api.leettrack.app
"""
import requests
import json
import sys
from datetime import datetime

# API base URL
API_BASE_URL = "https://api.leettrack.app/api/v1"


class Colors:
    GREEN = "\033[92m"
    RED = "\033[91m"
    YELLOW = "\033[93m"
    BLUE = "\033[94m"
    ENDC = "\033[0m"
    BOLD = "\033[1m"


def print_test_result(test_name, success, message="", response_time=None):
    """Print formatted test result"""
    status = (
        f"{Colors.GREEN}✓ PASS{Colors.ENDC}"
        if success
        else f"{Colors.RED}✗ FAIL{Colors.ENDC}"
    )
    time_str = f" ({response_time:.2f}s)" if response_time else ""
    print(f"{status} {test_name}{time_str}")
    if message:
        print(f"    {message}")


def test_health_endpoints():
    """Test basic health check endpoints"""
    print(f"\n{Colors.BOLD}Testing Health Endpoints{Colors.ENDC}")

    # Test root endpoint
    try:
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL.replace('/api/v1', '')}/", timeout=10)
        response_time = (datetime.now() - start_time).total_seconds()

        if response.status_code == 200:
            data = response.json()
            success = (
                data.get("name") == "LeetTrack API" and data.get("status") == "active"
            )
            print_test_result(
                "Root endpoint (/)",
                success,
                f"Status: {response.status_code}",
                response_time,
            )
        else:
            print_test_result(
                "Root endpoint (/)",
                False,
                f"Status: {response.status_code}",
                response_time,
            )
    except Exception as e:
        print_test_result("Root endpoint (/)", False, f"Error: {str(e)}")

    # Test ping endpoint
    try:
        start_time = datetime.now()
        response = requests.get(
            f"{API_BASE_URL.replace('/api/v1', '')}/ping", timeout=10
        )
        response_time = (datetime.now() - start_time).total_seconds()

        if response.status_code == 200:
            data = response.json()
            success = data.get("message") == "pong"
            print_test_result(
                "Ping endpoint (/ping)",
                success,
                f"Status: {response.status_code}",
                response_time,
            )
        else:
            print_test_result(
                "Ping endpoint (/ping)",
                False,
                f"Status: {response.status_code}",
                response_time,
            )
    except Exception as e:
        print_test_result("Ping endpoint (/ping)", False, f"Error: {str(e)}")


def test_leetcode_endpoints():
    """Test LeetCode endpoints"""
    print(f"\n{Colors.BOLD}Testing LeetCode Endpoints{Colors.ENDC}")

    # Test daily question
    try:
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/leetcode/daily", timeout=15)
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 200
        if success:
            data = response.json()
            # Check for actual response structure (date, link, question)
            success = "date" in data and "question" in data
        print_test_result(
            "Get daily question",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Get daily question", False, f"Error: {str(e)}")

    # Test problems list
    try:
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/leetcode/problems?limit=5", timeout=15)
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 200
        if success:
            data = response.json()
            # Check for actual response structure (questions array, total)
            success = "questions" in data and "total" in data
        print_test_result(
            "Get problems list",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Get problems list", False, f"Error: {str(e)}")

    # Test specific problem
    try:
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/leetcode/problem/two-sum", timeout=15)
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 200
        if success:
            data = response.json()
            # Check for actual response structure (problem details)
            success = "title" in data and "questionId" in data
        print_test_result(
            "Get specific problem",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Get specific problem", False, f"Error: {str(e)}")


def test_learning_paths_endpoints():
    """Test Learning Paths endpoints"""
    print(f"\n{Colors.BOLD}Testing Learning Paths Endpoints{Colors.ENDC}")

    # Test get learning paths
    try:
        start_time = datetime.now()
        response = requests.get(f"{API_BASE_URL}/learning-paths", timeout=10)
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 200
        if success:
            data = response.json()
            success = data.get("status") == "success" and "data" in data
        print_test_result(
            "Get learning paths",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Get learning paths", False, f"Error: {str(e)}")

    # Test learning paths with filters
    try:
        start_time = datetime.now()
        response = requests.get(
            f"{API_BASE_URL}/learning-paths?difficulty=Easy&limit=3", timeout=10
        )
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 200
        print_test_result(
            "Get filtered learning paths",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Get filtered learning paths", False, f"Error: {str(e)}")


def test_auth_endpoints():
    """Test authentication endpoints (public ones only)"""
    print(f"\n{Colors.BOLD}Testing Authentication Endpoints{Colors.ENDC}")

    # Test register endpoint with invalid data (should fail gracefully)
    try:
        start_time = datetime.now()
        test_data = {"email": "invalid-email", "password": ""}
        response = requests.post(
            f"{API_BASE_URL}/auth/register", json=test_data, timeout=10
        )
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 400  # Should reject invalid data
        print_test_result(
            "Register endpoint validation",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Register endpoint validation", False, f"Error: {str(e)}")

    # Test login endpoint with invalid data
    try:
        start_time = datetime.now()
        test_data = {"email": "nonexistent@example.com", "password": "wrongpassword"}
        response = requests.post(
            f"{API_BASE_URL}/auth/login", json=test_data, timeout=10
        )
        response_time = (datetime.now() - start_time).total_seconds()

        success = response.status_code == 401  # Should reject invalid credentials
        print_test_result(
            "Login endpoint validation",
            success,
            f"Status: {response.status_code}",
            response_time,
        )
    except Exception as e:
        print_test_result("Login endpoint validation", False, f"Error: {str(e)}")


def test_protected_endpoints():
    """Test that protected endpoints require authentication"""
    print(f"\n{Colors.BOLD}Testing Protected Endpoints{Colors.ENDC}")

    protected_endpoints = [
        "/auth/me",
        "/auth/user/dashboard/summary",
        "/auth/user/reviews/today",
        "/auth/user/questions/need-rating",
        "/leetcode/profile/stats",
        "/admin/learning-paths",
    ]

    for endpoint in protected_endpoints:
        try:
            start_time = datetime.now()
            response = requests.get(f"{API_BASE_URL}{endpoint}", timeout=10)
            response_time = (datetime.now() - start_time).total_seconds()

            success = response.status_code == 401  # Should require authentication
            print_test_result(
                f"Protected endpoint {endpoint}",
                success,
                f"Status: {response.status_code}",
                response_time,
            )
        except Exception as e:
            print_test_result(
                f"Protected endpoint {endpoint}", False, f"Error: {str(e)}"
            )


def test_cors_headers():
    """Test CORS headers"""
    print(f"\n{Colors.BOLD}Testing CORS Configuration{Colors.ENDC}")

    try:
        response = requests.get(f"{API_BASE_URL}/learning-paths", timeout=10)
        headers = response.headers

        # Check for CORS headers
        cors_headers = [
            "Access-Control-Allow-Origin",
            "Access-Control-Allow-Methods",
            "Access-Control-Allow-Headers",
        ]

        cors_configured = any(header in headers for header in cors_headers)
        print_test_result(
            "CORS headers present",
            cors_configured,
            f"Found headers: {[h for h in cors_headers if h in headers]}",
        )
    except Exception as e:
        print_test_result("CORS headers test", False, f"Error: {str(e)}")


def main():
    """Run all API tests"""
    print(f"{Colors.BOLD}{Colors.BLUE}LeetTrack API Live Testing{Colors.ENDC}")
    print(f"Testing API at: {API_BASE_URL}")
    print(f"Timestamp: {datetime.now().strftime('%Y-%m-%d %H:%M:%S')}")

    # Run all test suites
    test_health_endpoints()
    test_leetcode_endpoints()
    test_learning_paths_endpoints()
    test_auth_endpoints()
    test_protected_endpoints()
    test_cors_headers()

    print(f"\n{Colors.BOLD}API Testing Complete{Colors.ENDC}")
    print(
        f"\n{Colors.YELLOW}Note: Some external API-dependent tests may fail due to rate limiting or external service issues.{Colors.ENDC}"
    )
    print(
        f"{Colors.YELLOW}This is normal and doesn't indicate problems with your API.{Colors.ENDC}"
    )


if __name__ == "__main__":
    main()
