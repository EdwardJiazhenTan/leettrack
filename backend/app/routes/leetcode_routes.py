from flask import Blueprint, jsonify, request, g
from app.utils.leetcode_graphql import leetcode_client
from app.models.question import Question
from app import db
from datetime import datetime
from sqlalchemy.exc import SQLAlchemyError
import logging

logger = logging.getLogger(__name__)

leetcode = Blueprint('leetcode', __name__, url_prefix='/api/v1/leetcode')

def _handle_graphql_response(graphql_response, success_message="Success"):
    """Handle GraphQL response and return appropriate Flask response"""
    if isinstance(graphql_response, dict) and 'error' in graphql_response:
        # GraphQL returned an error
        return jsonify({
            'status': 'error',
            'message': graphql_response.get('error', 'Unknown error'),
            'details': graphql_response.get('details')
        }), 500
    
    if graphql_response is None:
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve data from LeetCode GraphQL API'
        }), 500
    
    return graphql_response, 200

@leetcode.route('/stats', methods=['GET'])
def get_user_stats():
    """Get LeetCode statistics for the authenticated user"""
    try:
        # Get the authenticated user's LeetCode username
        leetcode_username = g.user.leetcode_username
        if not leetcode_username:
            return jsonify({
                'status': 'error',
                'message': 'No LeetCode username associated with this account'
            }), 400
        
        # Get user profile from LeetCode GraphQL API
        profile_data = leetcode_client.get_user_profile(leetcode_username)
        profile_response, status_code = _handle_graphql_response(profile_data)
        if status_code != 200:
            return profile_response, status_code
        
        # Combine data
        stats = {
            'username': leetcode_username,
            'profile': profile_data
        }
        
        return jsonify(stats), 200
    
    except Exception as e:
        logger.error(f"Error getting user stats: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching user statistics'
        }), 500

@leetcode.route('/submissions', methods=['GET'])
def get_user_submissions():
    """Get recent submissions for the authenticated user"""
    try:
        # Get the authenticated user's LeetCode username
        leetcode_username = g.user.leetcode_username
        if not leetcode_username:
            return jsonify({
                'status': 'error',
                'message': 'No LeetCode username associated with this account'
            }), 400
        
        # Get user profile which includes recent submissions
        profile_data = leetcode_client.get_user_profile(leetcode_username)
        response, status_code = _handle_graphql_response(profile_data)
        if status_code != 200:
            return response, status_code
        
        return jsonify({
            'username': leetcode_username,
            'submissions': profile_data.get('recentSubmissions', [])
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting user submissions: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching submissions'
        }), 500

@leetcode.route('/daily', methods=['GET'])
def get_daily_question():
    """Get the daily LeetCode question"""
    try:
        # Get daily question from LeetCode GraphQL API
        daily_question = leetcode_client.get_daily_problem()
        response, status_code = _handle_graphql_response(daily_question)
        if status_code != 200:
            return response, status_code
        
        # Extract question data
        question_data = daily_question.get('question', {})
        question_id = question_data.get('questionId')
        
        # Check if the question already exists in our database
        if question_id:
            question = Question.query.filter_by(leetcode_id=question_id).first()
            
            # If it doesn't exist, add it to our database
            if not question:
                try:
                    question = Question(
                        leetcode_id=question_id,
                        title=question_data.get('title'),
                        url=f"https://leetcode.com/problems/{question_data.get('titleSlug')}/",
                        difficulty=question_data.get('difficulty'),
                        tags=','.join(tag.get('name', '') for tag in question_data.get('topicTags', [])),
                        description=question_data.get('content'),
                        last_updated=datetime.utcnow()
                    )
                    db.session.add(question)
                    db.session.commit()
                    logger.info(f"Added daily question to database: {question_data.get('title')}")
                except SQLAlchemyError as e:
                    db.session.rollback()
                    logger.error(f"Error adding daily question to database: {str(e)}")
        
        return jsonify(daily_question), 200
    
    except Exception as e:
        logger.error(f"Error getting daily question: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching the daily question'
        }), 500

@leetcode.route('/problem/<title_slug>', methods=['GET'])
def get_problem_by_slug(title_slug):
    """Get a specific LeetCode problem by its title slug"""
    try:
        # Get problem details from LeetCode GraphQL API
        problem = leetcode_client.get_problem_by_slug(title_slug)
        response, status_code = _handle_graphql_response(problem)
        if status_code != 200:
            return response, status_code
        
        # Check if the question already exists in our database
        question_id = problem.get('questionId')
        if question_id:
            question = Question.query.filter_by(leetcode_id=question_id).first()
            
            # If it doesn't exist, add it to our database
            if not question:
                try:
                    question = Question(
                        leetcode_id=question_id,
                        title=problem.get('title'),
                        url=f"https://leetcode.com/problems/{problem.get('titleSlug')}/",
                        difficulty=problem.get('difficulty'),
                        tags=','.join(tag.get('name', '') for tag in problem.get('topicTags', [])),
                        description=problem.get('content'),
                        last_updated=datetime.utcnow()
                    )
                    db.session.add(question)
                    db.session.commit()
                    logger.info(f"Added problem to database: {problem.get('title')}")
                except SQLAlchemyError as e:
                    db.session.rollback()
                    logger.error(f"Error adding problem to database: {str(e)}")
        
        return jsonify(problem), 200
    
    except Exception as e:
        logger.error(f"Error getting problem by slug: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred while fetching the problem: {title_slug}'
        }), 500

@leetcode.route('/problems', methods=['GET'])
def get_problems():
    """Get a list of LeetCode problems with optional filters"""
    try:
        # Get filter parameters
        limit = request.args.get('limit', default=20, type=int)
        skip = request.args.get('skip', default=0, type=int)
        tags = request.args.get('tags')
        difficulty = request.args.get('difficulty')
        
        # Parse tags if provided
        tags_list = tags.split(',') if tags else None
        
        # Get problems from LeetCode GraphQL API
        problems = leetcode_client.get_problems_list(
            limit=limit, 
            skip=skip, 
            difficulty=difficulty, 
            tags=tags_list
        )
        response, status_code = _handle_graphql_response(problems)
        if status_code != 200:
            return response, status_code
        
        # Process and store problems in our database
        problems_list = problems.get('questions', [])
        for problem in problems_list:
            question_id = problem.get('frontendQuestionId')
            if question_id:
                question = Question.query.filter_by(leetcode_id=question_id).first()
                if not question:
                    try:
                        question = Question(
                            leetcode_id=question_id,
                            title=problem.get('title'),
                            url=f"https://leetcode.com/problems/{problem.get('titleSlug')}/",
                            difficulty=problem.get('difficulty'),
                            tags=','.join(tag.get('name', '') for tag in problem.get('topicTags', [])),
                            last_updated=datetime.utcnow()
                        )
                        db.session.add(question)
                    except SQLAlchemyError as e:
                        logger.error(f"Error adding problem to database: {str(e)}")
        
        try:
            db.session.commit()
            logger.info(f"Successfully processed {len(problems_list)} problems")
        except SQLAlchemyError as e:
            db.session.rollback()
            logger.error(f"Error committing problems to database: {str(e)}")
        
        return jsonify(problems), 200
    
    except Exception as e:
        logger.error(f"Error getting problems: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching problems'
        }), 500

@leetcode.route('/calendar', methods=['GET'])
def get_user_calendar():
    """Get calendar data for the authenticated user"""
    try:
        # Get the authenticated user's LeetCode username
        leetcode_username = g.user.leetcode_username
        if not leetcode_username:
            return jsonify({
                'status': 'error',
                'message': 'No LeetCode username associated with this account'
            }), 400
        
        # Get year parameter
        year = request.args.get('year', default=datetime.now().year, type=int)
        
        # Get user profile which includes submission calendar
        profile_data = leetcode_client.get_user_profile(leetcode_username)
        response, status_code = _handle_graphql_response(profile_data)
        if status_code != 200:
            return response, status_code
        
        # Extract calendar data from profile
        calendar_data = profile_data.get('profile', {}).get('submissionCalendar', '{}')
        
        return jsonify({
            'username': leetcode_username,
            'year': year,
            'calendar_data': calendar_data
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting user calendar: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'An error occurred while fetching calendar data'
        }), 500 