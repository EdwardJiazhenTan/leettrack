import requests
from flask import current_app
import logging
import time
from datetime import datetime, timedelta
import json

logger = logging.getLogger(__name__)


class LeetCodeAPI:
    """Utility class to interact with the alfa-leetcode-api"""

    def __init__(self):
        # Don't access current_app during initialization
        self.base_url = None
        self.last_request_time = None
        self.rate_limit_reset = None
        self.cache = {}  # Simple in-memory cache
        self.cache_duration = 300  # 5 minutes cache

    def _ensure_initialized(self):
        """Ensure the API is initialized with proper configuration"""
        if self.base_url is None:
            from flask import current_app

            self.base_url = current_app.config.get(
                "LEETCODE_API_BASE_URL", "https://alfa-leetcode-api.onrender.com"
            )

    def _is_cached_valid(self, cache_key):
        """Check if cached data is still valid"""
        if cache_key not in self.cache:
            return False

        cached_time, _ = self.cache[cache_key]
        return (datetime.now() - cached_time).seconds < self.cache_duration

    def _get_from_cache(self, cache_key):
        """Get data from cache if valid"""
        if self._is_cached_valid(cache_key):
            _, data = self.cache[cache_key]
            logger.info(f"Returning cached data for {cache_key}")
            return data
        return None

    def _set_cache(self, cache_key, data):
        """Set data in cache"""
        self.cache[cache_key] = (datetime.now(), data)

    def _handle_rate_limit(self, response):
        """Handle rate limit response and extract reset time"""
        if response.status_code == 429:
            # Extract rate limit info from headers
            reset_time = response.headers.get("retry-after")
            if reset_time:
                self.rate_limit_reset = datetime.now() + timedelta(
                    seconds=int(reset_time)
                )
                logger.warning(f"Rate limit hit. Reset at: {self.rate_limit_reset}")

            return {
                "error": "Rate limit exceeded",
                "message": (
                    f"Too many requests. Try again in {reset_time} seconds"
                    if reset_time
                    else "Rate limit exceeded"
                ),
                "retry_after": reset_time,
            }
        return None

    def _make_request(self, endpoint, params=None):
        """Make a request to the LeetCode API and handle errors"""
        self._ensure_initialized()  # Ensure base_url is set

        # Create cache key
        cache_key = f"{endpoint}_{str(params) if params else 'no_params'}"

        # Check cache first
        cached_data = self._get_from_cache(cache_key)
        if cached_data:
            return cached_data

        # Check if we're still in rate limit period
        if self.rate_limit_reset and datetime.now() < self.rate_limit_reset:
            remaining_time = (self.rate_limit_reset - datetime.now()).seconds
            logger.warning(
                f"Still in rate limit period. {remaining_time} seconds remaining"
            )
            return {
                "error": "Rate limit active",
                "message": f"Rate limit active. Try again in {remaining_time} seconds",
                "retry_after": remaining_time,
            }

        try:
            url = f"{self.base_url}{endpoint}"
            logger.info(f"Making request to: {url}")

            # Add delay between requests to be respectful
            if self.last_request_time:
                time_since_last = (datetime.now() - self.last_request_time).seconds
                if time_since_last < 1:  # Wait at least 1 second between requests
                    time.sleep(1 - time_since_last)

            response = requests.get(url, params=params, timeout=30)
            self.last_request_time = datetime.now()

            # Handle rate limiting
            rate_limit_response = self._handle_rate_limit(response)
            if rate_limit_response:
                return rate_limit_response

            # Handle other HTTP errors
            if response.status_code != 200:
                logger.error(f"HTTP {response.status_code}: {response.text[:200]}")
                return {
                    "error": f"HTTP {response.status_code}",
                    "message": (
                        response.text[:200] if response.text else "Unknown error"
                    ),
                }

            data = response.json()

            # Cache successful responses
            self._set_cache(cache_key, data)

            return data

        except requests.exceptions.Timeout:
            logger.error("Request timeout")
            return {"error": "Timeout", "message": "Request timed out"}
        except requests.exceptions.ConnectionError:
            logger.error("Connection error")
            return {
                "error": "Connection Error",
                "message": "Unable to connect to LeetCode API",
            }
        except requests.exceptions.RequestException as e:
            logger.error(f"Request error: {str(e)}")
            return {"error": "Request Error", "message": str(e)}
        except json.JSONDecodeError:
            logger.error("Invalid JSON response")
            return {
                "error": "Invalid Response",
                "message": "Invalid JSON response from API",
            }
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return {"error": "Unexpected Error", "message": str(e)}

    def get_user_profile(self, username):
        """Get a user's profile information"""
        return self._make_request(f"/{username}")

    def get_user_solved(self, username):
        """Get a user's solved questions information"""
        return self._make_request(f"/{username}/solved")

    def get_user_contest(self, username):
        """Get a user's contest information"""
        return self._make_request(f"/{username}/contest")

    def get_user_contest_history(self, username):
        """Get a user's contest history"""
        return self._make_request(f"/{username}/contest/history")

    def get_user_submissions(self, username, limit=None):
        """Get a user's recent submissions"""
        params = {"limit": limit} if limit else None
        return self._make_request(f"/{username}/submission", params)

    def get_user_accepted_submissions(self, username, limit=None):
        """Get a user's recent accepted submissions"""
        params = {"limit": limit} if limit else None
        return self._make_request(f"/{username}/acSubmission", params)

    def get_user_calendar(self, username):
        """Get a user's submission calendar"""
        return self._make_request(f"/{username}/calendar")

    def get_daily_question(self):
        """Get the daily LeetCode question"""
        return self._make_request("/daily")

    def get_question_by_slug(self, title_slug):
        """Get details about a specific question by its title slug"""
        return self._make_request(f"/select?titleSlug={title_slug}")

    def get_problems(self, limit=None, skip=None, tags=None, difficulty=None):
        """Get a list of LeetCode problems with optional filters"""
        params = {}
        if limit:
            params["limit"] = limit
        if skip:
            params["skip"] = skip
        if tags:
            # Convert list of tags to the expected format: "tag1+tag2+tag3"
            if isinstance(tags, list):
                params["tags"] = "+".join(tags)
            else:
                params["tags"] = tags
        if difficulty:
            params["difficulty"] = difficulty.upper()

        return self._make_request("/problems", params)

    def get_user_language_stats(self, username):
        """Get a user's language usage statistics"""
        return self._make_request(f"/languageStats?username={username}")

    def get_user_skill_stats(self, username):
        """Get a user's skill statistics"""
        return self._make_request(f"/skillStats/{username}")

    def get_user_full_profile(self, username):
        """Get full profile details for a user in one call"""
        return self._make_request(f"/userProfile/{username}")

    def get_user_yearly_calendar(self, username, year):
        """Get a user's calendar details for a specific year"""
        return self._make_request(
            f"/userProfileCalendar?username={username}&year={year}"
        )


# Create an instance of the LeetCodeAPI class
leetcode_api = LeetCodeAPI()
