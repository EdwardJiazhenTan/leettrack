"""
LeetCode GraphQL Client - Direct integration with LeetCode's GraphQL API
Extracted and adapted from alfa-leetcode-api (MIT License)
"""

import requests
import json
import time
from typing import Dict, Any, Optional, List
from datetime import datetime, timedelta
import logging

logger = logging.getLogger(__name__)


class LeetCodeGraphQLClient:
    """Direct GraphQL client for LeetCode API"""

    def __init__(self):
        self.base_url = "https://leetcode.com/graphql"
        self.headers = {
            "Content-Type": "application/json",
            "Referer": "https://leetcode.com",
            "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36",
        }
        self.session = requests.Session()
        self.session.headers.update(self.headers)

        # Simple in-memory cache
        self._cache = {}
        self._cache_timestamps = {}

    def _get_cache_key(self, query: str, variables: Dict = None) -> str:
        """Generate cache key for query and variables"""
        var_str = json.dumps(variables, sort_keys=True) if variables else ""
        return f"{hash(query)}_{hash(var_str)}"

    def _is_cache_valid(self, cache_key: str, ttl_minutes: int = 30) -> bool:
        """Check if cached data is still valid"""
        if cache_key not in self._cache_timestamps:
            return False

        cache_time = self._cache_timestamps[cache_key]
        return datetime.now() - cache_time < timedelta(minutes=ttl_minutes)

    def _execute_query(
        self, query: str, variables: Dict = None, cache_ttl: int = 30
    ) -> Dict[str, Any]:
        """Execute GraphQL query with caching"""
        cache_key = self._get_cache_key(query, variables)

        # Check cache first
        if self._is_cache_valid(cache_key, cache_ttl):
            logger.info(f"Cache hit for query: {query[:50]}...")
            return self._cache[cache_key]

        try:
            # Add small delay to be respectful
            time.sleep(0.1)

            payload = {"query": query, "variables": variables or {}}

            response = self.session.post(self.base_url, json=payload, timeout=10)
            response.raise_for_status()

            result = response.json()

            if "errors" in result:
                logger.error(f"GraphQL errors: {result['errors']}")
                return {"error": "GraphQL query failed", "details": result["errors"]}

            # Cache successful result
            self._cache[cache_key] = result
            self._cache_timestamps[cache_key] = datetime.now()

            return result

        except requests.exceptions.RequestException as e:
            logger.error(f"Request failed: {str(e)}")
            return {"error": "Network request failed", "details": str(e)}
        except json.JSONDecodeError as e:
            logger.error(f"JSON decode failed: {str(e)}")
            return {"error": "Invalid JSON response", "details": str(e)}
        except Exception as e:
            logger.error(f"Unexpected error: {str(e)}")
            return {"error": "Unexpected error", "details": str(e)}

    def get_daily_problem(self) -> Dict[str, Any]:
        """Get today's daily coding challenge"""
        query = """
        query getDailyProblem {
            activeDailyCodingChallengeQuestion {
                date
                link
                question {
                    questionId
                    questionFrontendId
                    boundTopicId
                    title
                    titleSlug
                    content
                    translatedTitle
                    translatedContent
                    isPaidOnly
                    difficulty
                    likes
                    dislikes
                    isLiked
                    similarQuestions
                    exampleTestcases
                    contributors {
                        username
                        profileUrl
                        avatarUrl
                    }
                    topicTags {
                        name
                        slug
                        translatedName
                    }
                    companyTagStats
                    codeSnippets {
                        lang
                        langSlug
                        code
                    }
                    stats
                    hints
                    solution {
                        id
                        canSeeDetail
                        paidOnly
                        hasVideoSolution
                        paidOnlyVideo
                    }
                    status
                    sampleTestCase
                    metaData
                    judgerAvailable
                    judgeType
                    mysqlSchemas
                    enableRunCode
                    enableTestMode
                    enableDebugger
                    envInfo
                    libraryUrl
                    adminUrl
                    challengeQuestion {
                        id
                        date
                        incompleteChallengeCount
                        streakCount
                        type
                    }
                    note
                }
            }
        }
        """

        result = self._execute_query(query, cache_ttl=60)  # Cache for 1 hour

        if "error" in result:
            return result

        # Format the response similar to alfa-leetcode-api
        try:
            daily_data = result["data"]["activeDailyCodingChallengeQuestion"]
            if not daily_data:
                return {"error": "No daily problem found"}

            question = daily_data["question"]

            return {
                "date": daily_data["date"],
                "link": daily_data["link"],
                "question": {
                    "questionId": question["questionId"],
                    "questionFrontendId": question["questionFrontendId"],
                    "title": question["title"],
                    "titleSlug": question["titleSlug"],
                    "content": question["content"],
                    "difficulty": question["difficulty"],
                    "likes": question["likes"],
                    "dislikes": question["dislikes"],
                    "isPaidOnly": question["isPaidOnly"],
                    "topicTags": question["topicTags"],
                    "codeSnippets": question["codeSnippets"],
                    "hints": question["hints"],
                    "exampleTestcases": question["exampleTestcases"],
                },
            }

        except (KeyError, TypeError) as e:
            logger.error(f"Error formatting daily problem response: {str(e)}")
            return {"error": "Failed to format response", "details": str(e)}

    def get_user_profile(self, username: str) -> Dict[str, Any]:
        """Get user profile data formatted to match external API"""
        query = """
        query getUserProfile($username: String!) {
            allQuestionsCount {
                difficulty
                count
            }
            matchedUser(username: $username) {
                username
                githubUrl
                twitterUrl
                linkedinUrl
                contributions {
                    points
                    questionCount
                    testcaseCount
                }
                profile {
                    realName
                    userAvatar
                    birthday
                    ranking
                    reputation
                    websites
                    countryName
                    company
                    school
                    skillTags
                    aboutMe
                    starRating
                }
                badges {
                    id
                    displayName
                    icon
                    creationDate
                }
                upcomingBadges {
                    name
                    icon
                }
                activeBadge {
                    id
                    displayName
                    icon
                    creationDate
                }
                submitStats {
                    totalSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                    acSubmissionNum {
                        difficulty
                        count
                        submissions
                    }
                }
                submissionCalendar
            }
            recentSubmissionList(username: $username, limit: 20) {
                title
                titleSlug
                timestamp
                statusDisplay
                lang
                __typename
            }
        }
        """

        result = self._execute_query(
            query, {"username": username}, cache_ttl=15
        )  # Cache for 15 minutes

        if "error" in result:
            return result

        try:
            user_data = result["data"]["matchedUser"]
            all_questions = result["data"]["allQuestionsCount"]

            if not user_data:
                return {"error": f"User {username} not found"}

            # Extract submission stats
            submit_stats = user_data["submitStats"]
            ac_stats = submit_stats["acSubmissionNum"]
            total_stats = submit_stats["totalSubmissionNum"]

            # Find stats by difficulty
            def find_stat(stats_list, difficulty):
                for stat in stats_list:
                    if stat["difficulty"] == difficulty:
                        return stat
                return {"count": 0, "submissions": 0}

            easy_ac = find_stat(ac_stats, "Easy")
            medium_ac = find_stat(ac_stats, "Medium")
            hard_ac = find_stat(ac_stats, "Hard")
            all_ac = find_stat(ac_stats, "All")

            # Get total question counts
            def find_total_questions(all_questions, difficulty):
                for q in all_questions:
                    if q["difficulty"] == difficulty:
                        return q["count"]
                return 0

            total_easy = find_total_questions(all_questions, "Easy")
            total_medium = find_total_questions(all_questions, "Medium")
            total_hard = find_total_questions(all_questions, "Hard")

            # Format response to match external API structure
            formatted_response = {
                "contributionPoint": user_data["contributions"]["points"],
                "easySolved": easy_ac["count"],
                "hardSolved": hard_ac["count"],
                "matchedUserStats": {
                    "acSubmissionNum": submit_stats["acSubmissionNum"],
                    "totalSubmissionNum": submit_stats["totalSubmissionNum"],
                },
                "mediumSolved": medium_ac["count"],
                "ranking": user_data["profile"]["ranking"],
                "recentSubmissions": result["data"]["recentSubmissionList"],
                "reputation": user_data["profile"]["reputation"],
                "submissionCalendar": user_data["submissionCalendar"],
                "totalEasy": total_easy,
                "totalHard": total_hard,
                "totalMedium": total_medium,
                "totalQuestions": total_easy + total_medium + total_hard,
                "totalSolved": all_ac["count"],
                "totalSubmissions": submit_stats["totalSubmissionNum"],
            }

            return formatted_response

        except (KeyError, TypeError) as e:
            logger.error(f"Error formatting user profile response: {str(e)}")
            return {"error": "Failed to format response", "details": str(e)}

    def get_problem_by_slug(self, title_slug: str) -> Dict[str, Any]:
        """Get specific problem by title slug"""
        query = """
        query getQuestionDetail($titleSlug: String!) {
            question(titleSlug: $titleSlug) {
                questionId
                questionFrontendId
                boundTopicId
                title
                titleSlug
                content
                translatedTitle
                translatedContent
                isPaidOnly
                difficulty
                likes
                dislikes
                isLiked
                similarQuestions
                exampleTestcases
                contributors {
                    username
                    profileUrl
                    avatarUrl
                }
                topicTags {
                    name
                    slug
                    translatedName
                }
                companyTagStats
                codeSnippets {
                    lang
                    langSlug
                    code
                }
                stats
                hints
                solution {
                    id
                    canSeeDetail
                    paidOnly
                    hasVideoSolution
                    paidOnlyVideo
                }
                status
                sampleTestCase
                metaData
                judgerAvailable
                judgeType
                mysqlSchemas
                enableRunCode
                enableTestMode
                enableDebugger
                envInfo
                libraryUrl
                adminUrl
                note
            }
        }
        """

        result = self._execute_query(
            query, {"titleSlug": title_slug}, cache_ttl=60
        )  # Cache for 1 hour

        if "error" in result:
            return result

        try:
            question = result["data"]["question"]
            if not question:
                return {"error": f"Problem {title_slug} not found"}

            return question

        except (KeyError, TypeError) as e:
            logger.error(f"Error formatting problem response: {str(e)}")
            return {"error": "Failed to format response", "details": str(e)}

    def get_problems_list(
        self,
        limit: int = 50,
        skip: int = 0,
        difficulty: str = None,
        tags: List[str] = None,
    ) -> Dict[str, Any]:
        """Get list of problems with filters"""
        query = """
        query problemsetQuestionList($categorySlug: String, $limit: Int, $skip: Int, $filters: QuestionListFilterInput) {
            problemsetQuestionList: questionList(
                categorySlug: $categorySlug
                limit: $limit
                skip: $skip
                filters: $filters
            ) {
                total: totalNum
                questions: data {
                    acRate
                    difficulty
                    freqBar
                    frontendQuestionId: questionFrontendId
                    isFavor
                    paidOnly: isPaidOnly
                    status
                    title
                    titleSlug
                    topicTags {
                        name
                        id
                        slug
                    }
                    hasSolution
                    hasVideoSolution
                }
            }
        }
        """

        filters = {}
        if difficulty:
            filters["difficulty"] = difficulty.upper()
        if tags:
            filters["tags"] = tags

        variables = {
            "categorySlug": "",
            "limit": limit,
            "skip": skip,
            "filters": filters,
        }

        result = self._execute_query(
            query, variables, cache_ttl=30
        )  # Cache for 30 minutes

        if "error" in result:
            return result

        try:
            problem_list = result["data"]["problemsetQuestionList"]
            return {
                "total": problem_list["total"],
                "questions": problem_list["questions"],
            }

        except (KeyError, TypeError) as e:
            logger.error(f"Error formatting problems list response: {str(e)}")
            return {"error": "Failed to format response", "details": str(e)}


# Global instance
leetcode_client = LeetCodeGraphQLClient()
