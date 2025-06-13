"""
LeetCode Statistics Utility Functions
Processes GraphQL API responses to extract specific statistics for frontend display
"""

from typing import Dict, Any, List
from collections import Counter
from datetime import datetime, timedelta
import json
import logging

logger = logging.getLogger(__name__)

def extract_solving_stats(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract total solved and difficulty breakdown stats"""
    try:
        return {
            'totalSolved': profile_data.get('totalSolved', 0),
            'easySolved': profile_data.get('easySolved', 0),
            'mediumSolved': profile_data.get('mediumSolved', 0),
            'hardSolved': profile_data.get('hardSolved', 0),
            'totalQuestions': profile_data.get('totalQuestions', 0),
            'totalEasy': profile_data.get('totalEasy', 0),
            'totalMedium': profile_data.get('totalMedium', 0),
            'totalHard': profile_data.get('totalHard', 0),
            'ranking': profile_data.get('ranking', 0),
            'contributionPoint': profile_data.get('contributionPoint', 0)
        }
    except Exception as e:
        logger.error(f"Error extracting solving stats: {str(e)}")
        return {
            'totalSolved': 0, 'easySolved': 0, 'mediumSolved': 0, 'hardSolved': 0,
            'totalQuestions': 0, 'totalEasy': 0, 'totalMedium': 0, 'totalHard': 0,
            'ranking': 0, 'contributionPoint': 0
        }

def extract_recent_submissions(profile_data: Dict[str, Any], limit: int = 10) -> List[Dict[str, Any]]:
    """Extract and format recent submissions"""
    try:
        recent_submissions = profile_data.get('recentSubmissions', [])
        
        formatted_submissions = []
        for submission in recent_submissions[:limit]:
            # Convert timestamp to readable date
            timestamp = int(submission.get('timestamp', 0))
            submission_date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d %H:%M')
            
            formatted_submissions.append({
                'title': submission.get('title', 'Unknown'),
                'titleSlug': submission.get('titleSlug', ''),
                'status': submission.get('statusDisplay', 'Unknown'),
                'language': submission.get('lang', 'Unknown'),
                'date': submission_date,
                'timestamp': timestamp,
                'url': f"https://leetcode.com/problems/{submission.get('titleSlug', '')}/"
            })
        
        return formatted_submissions
    except Exception as e:
        logger.error(f"Error extracting recent submissions: {str(e)}")
        return []

def extract_language_stats(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract language usage statistics from recent submissions"""
    try:
        recent_submissions = profile_data.get('recentSubmissions', [])
        
        # Count languages from recent submissions
        language_counter = Counter()
        for submission in recent_submissions:
            lang = submission.get('lang', 'Unknown')
            if lang and lang != 'Unknown':
                language_counter[lang] += 1
        
        # Convert to list of dictionaries for frontend
        language_stats = [
            {'language': lang, 'count': count}
            for lang, count in language_counter.most_common()
        ]
        
        return {
            'languages': language_stats,
            'totalSubmissions': len(recent_submissions),
            'uniqueLanguages': len(language_counter)
        }
    except Exception as e:
        logger.error(f"Error extracting language stats: {str(e)}")
        return {'languages': [], 'totalSubmissions': 0, 'uniqueLanguages': 0}

def extract_submission_calendar(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Extract and format submission calendar data"""
    try:
        calendar_data = profile_data.get('submissionCalendar', {})
        
        if isinstance(calendar_data, str):
            calendar_data = json.loads(calendar_data) if calendar_data else {}
        
        # Convert timestamps to dates and organize data
        daily_submissions = []
        total_active_days = 0
        max_submissions_per_day = 0
        
        for timestamp_str, count in calendar_data.items():
            timestamp = int(timestamp_str)
            date = datetime.fromtimestamp(timestamp).strftime('%Y-%m-%d')
            
            if count > 0:
                total_active_days += 1
                max_submissions_per_day = max(max_submissions_per_day, count)
            
            daily_submissions.append({
                'date': date,
                'count': count,
                'timestamp': timestamp
            })
        
        # Sort by date
        daily_submissions.sort(key=lambda x: x['timestamp'])
        
        # Get recent activity (last 30 days)
        thirty_days_ago = datetime.now() - timedelta(days=30)
        recent_activity = [
            sub for sub in daily_submissions 
            if sub['timestamp'] >= thirty_days_ago.timestamp()
        ]
        
        return {
            'dailySubmissions': daily_submissions,
            'recentActivity': recent_activity,
            'totalActiveDays': total_active_days,
            'maxSubmissionsPerDay': max_submissions_per_day,
            'totalSubmissions': sum(calendar_data.values())
        }
    except Exception as e:
        logger.error(f"Error extracting submission calendar: {str(e)}")
        return {
            'dailySubmissions': [], 'recentActivity': [], 
            'totalActiveDays': 0, 'maxSubmissionsPerDay': 0, 'totalSubmissions': 0
        }

def extract_difficulty_progress(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Calculate progress percentages for each difficulty"""
    try:
        stats = extract_solving_stats(profile_data)
        
        easy_progress = (stats['easySolved'] / stats['totalEasy'] * 100) if stats['totalEasy'] > 0 else 0
        medium_progress = (stats['mediumSolved'] / stats['totalMedium'] * 100) if stats['totalMedium'] > 0 else 0
        hard_progress = (stats['hardSolved'] / stats['totalHard'] * 100) if stats['totalHard'] > 0 else 0
        total_progress = (stats['totalSolved'] / stats['totalQuestions'] * 100) if stats['totalQuestions'] > 0 else 0
        
        return {
            'easy': {
                'solved': stats['easySolved'],
                'total': stats['totalEasy'],
                'percentage': round(easy_progress, 1)
            },
            'medium': {
                'solved': stats['mediumSolved'],
                'total': stats['totalMedium'],
                'percentage': round(medium_progress, 1)
            },
            'hard': {
                'solved': stats['hardSolved'],
                'total': stats['totalHard'],
                'percentage': round(hard_progress, 1)
            },
            'overall': {
                'solved': stats['totalSolved'],
                'total': stats['totalQuestions'],
                'percentage': round(total_progress, 1)
            }
        }
    except Exception as e:
        logger.error(f"Error calculating difficulty progress: {str(e)}")
        return {
            'easy': {'solved': 0, 'total': 0, 'percentage': 0},
            'medium': {'solved': 0, 'total': 0, 'percentage': 0},
            'hard': {'solved': 0, 'total': 0, 'percentage': 0},
            'overall': {'solved': 0, 'total': 0, 'percentage': 0}
        }

def get_comprehensive_stats(profile_data: Dict[str, Any]) -> Dict[str, Any]:
    """Get all statistics in one comprehensive response"""
    try:
        return {
            'solvingStats': extract_solving_stats(profile_data),
            'recentSubmissions': extract_recent_submissions(profile_data),
            'languageStats': extract_language_stats(profile_data),
            'submissionCalendar': extract_submission_calendar(profile_data),
            'difficultyProgress': extract_difficulty_progress(profile_data)
        }
    except Exception as e:
        logger.error(f"Error getting comprehensive stats: {str(e)}")
        return {
            'solvingStats': extract_solving_stats({}),
            'recentSubmissions': [],
            'languageStats': {'languages': [], 'totalSubmissions': 0, 'uniqueLanguages': 0},
            'submissionCalendar': {'dailySubmissions': [], 'recentActivity': [], 'totalActiveDays': 0, 'maxSubmissionsPerDay': 0, 'totalSubmissions': 0},
            'difficultyProgress': extract_difficulty_progress({})
        } 