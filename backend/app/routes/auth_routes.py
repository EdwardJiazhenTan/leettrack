from flask import Blueprint, request, jsonify, g
from flask_jwt_extended import (
    create_access_token, create_refresh_token,
    jwt_required, get_jwt_identity, get_jwt
)
from app.models.user import User
from app import db
from passlib.hash import bcrypt
from datetime import datetime, timedelta
import logging
from app.config.config import Config
from app.models.user_question import UserQuestion
from app.models.question import Question
from app.models.user_learning_path import UserLearningPath
from app.models.learning_path import LearningPath
from app.models.path_question import PathQuestion
from app.utils.leetcode_graphql import LeetCodeGraphQLClient

logger = logging.getLogger(__name__)

auth = Blueprint('auth', __name__, url_prefix='/api/v1/auth')

# Store blacklisted tokens (in production, use Redis or database)
blacklisted_tokens = set()

def extract_title_slug_from_url(url):
    """Extract title slug from LeetCode URL"""
    # URL format: https://leetcode.com/problems/title-slug/
    if '/problems/' in url:
        parts = url.split('/problems/')
        if len(parts) > 1:
            slug_part = parts[1].rstrip('/')
            return slug_part
    return None

@auth.route('/register', methods=['POST'])
def register():
    """Register a new user and return JWT tokens"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['email', 'password', 'leetcode_username']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Check if email already exists
        if User.query.filter_by(email=data['email']).first():
            return jsonify({'message': 'Email already registered'}), 409
        
        # Create new user
        password_hash = bcrypt.hash(data['password'])
        new_user = User(
            email=data['email'],
            password_hash=password_hash,
            leetcode_username=data['leetcode_username'],
            created_at=datetime.utcnow()
        )
        
        db.session.add(new_user)
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(new_user.user_id))
        refresh_token = create_refresh_token(identity=str(new_user.user_id))
        
        return jsonify({
            'message': 'Registration successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': new_user.user_id,
                'email': new_user.email,
                'leetcode_username': new_user.leetcode_username,
                'is_admin': new_user.is_admin
            }
        }), 201
    
    except Exception as e:
        logger.error(f"Error during registration: {str(e)}")
        db.session.rollback()
        return jsonify({'message': 'An error occurred during registration'}), 500

@auth.route('/login', methods=['POST'])
def login():
    """Authenticate a user and return JWT tokens"""
    try:
        data = request.get_json()
        
        # Validate required fields
        if not all(k in data for k in ['email', 'password']):
            return jsonify({'message': 'Missing required fields'}), 400
        
        # Find user
        user = User.query.filter_by(email=data['email']).first()
        if not user or not bcrypt.verify(data['password'], user.password_hash):
            return jsonify({'message': 'Invalid email or password'}), 401
        
        # Update last login time
        user.last_login = datetime.utcnow()
        db.session.commit()
        
        # Generate tokens
        access_token = create_access_token(identity=str(user.user_id))
        refresh_token = create_refresh_token(identity=str(user.user_id))
        
        return jsonify({
            'message': 'Login successful',
            'access_token': access_token,
            'refresh_token': refresh_token,
            'user': {
                'id': user.user_id,
                'email': user.email,
                'leetcode_username': user.leetcode_username,
                'is_admin': user.is_admin
            }
        }), 200
    
    except Exception as e:
        logger.error(f"Error during login: {str(e)}")
        return jsonify({'message': 'An error occurred during login'}), 500

@auth.route('/refresh', methods=['POST'])
@jwt_required(refresh=True)
def refresh():
    """Generate a new access token using a refresh token"""
    try:
        current_user_id = get_jwt_identity()
        access_token = create_access_token(identity=current_user_id)
        
        return jsonify({
            'access_token': access_token
        }), 200
    
    except Exception as e:
        logger.error(f"Error refreshing token: {str(e)}")
        return jsonify({'message': 'An error occurred while refreshing token'}), 500

@auth.route('/me', methods=['GET'])
@jwt_required()
def me():
    """Get the current user's profile"""
    try:
        current_user_id = get_jwt_identity()
        user = User.query.get(int(current_user_id))
        
        if not user:
            return jsonify({'message': 'User not found'}), 404
        
        return jsonify({
            'id': user.user_id,
            'email': user.email,
            'leetcode_username': user.leetcode_username,
            'is_admin': user.is_admin,
            'created_at': user.created_at,
            'last_login': user.last_login
        }), 200
    
    except Exception as e:
        logger.error(f"Error getting user profile: {str(e)}")
        return jsonify({'message': 'An error occurred while getting user profile'}), 500

@auth.route('/logout', methods=['POST'])
@jwt_required()
def logout():
    """Logout user (blacklist token)"""
    try:
        token = get_jwt()
        jti = token['jti']
        blacklisted_tokens.add(jti)
        
        return jsonify({
            'status': 'success',
            'message': 'Successfully logged out'
        }), 200
        
    except Exception as e:
        logger.error(f"Logout error: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Logout failed'
        }), 500

# Review System Endpoints

@auth.route('/user/questions/need-rating', methods=['GET'])
@jwt_required()
def get_questions_needing_rating():
    """Get questions that need to be rated by the user"""
    try:
        current_user_id = int(get_jwt_identity())
        
        # Get questions that need rating
        questions_needing_rating = db.session.query(UserQuestion, Question).join(
            Question, UserQuestion.question_id == Question.question_id
        ).filter(
            UserQuestion.user_id == current_user_id,
            UserQuestion.needs_rating == True
        ).order_by(UserQuestion.solved_at.desc()).all()
        
        questions_data = []
        for user_question, question in questions_needing_rating:
            questions_data.append({
                'user_question_id': user_question.user_question_id,
                'question_id': question.question_id,
                'title': question.title,
                'url': question.url,
                'difficulty': question.difficulty,
                'solved_at': user_question.solved_at.isoformat() if user_question.solved_at else None,
                'times_reviewed': user_question.times_reviewed or 0
            })
        
        return jsonify({
            'status': 'success',
            'data': {
                'questions': questions_data,
                'confidence_levels': Config.REVIEW_CONFIDENCE_LEVELS
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting questions needing rating: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve questions needing rating'
        }), 500

@auth.route('/user/questions/<int:user_question_id>/rate', methods=['POST'])
@jwt_required()
def rate_question(user_question_id):
    """Rate a question's difficulty/confidence level"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data or 'confidence' not in data:
            return jsonify({
                'status': 'error',
                'message': 'Confidence level is required'
            }), 400
        
        confidence = data['confidence']
        valid_levels = [level['value'] for level in Config.REVIEW_CONFIDENCE_LEVELS]
        
        if confidence not in valid_levels:
            return jsonify({
                'status': 'error',
                'message': f'Invalid confidence level. Must be one of: {valid_levels}'
            }), 400
        
        # Get the user question
        user_question = UserQuestion.query.filter_by(
            user_question_id=user_question_id,
            user_id=current_user_id
        ).first()
        
        if not user_question:
            return jsonify({
                'status': 'error',
                'message': 'Question not found or access denied'
            }), 404
        
        # Set the confidence level (this will automatically schedule the next review)
        user_question.set_review_confidence(confidence)
        
        # Add optional notes
        if data.get('notes'):
            user_question.review_notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Question rated successfully',
            'data': {
                'next_review': user_question.next_review.isoformat() if user_question.next_review else None,
                'confidence': user_question.review_confidence
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error rating question {user_question_id}: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to rate question'
        }), 500

@auth.route('/user/reviews/today', methods=['GET'])
@jwt_required()
def get_todays_reviews():
    """Get questions due for review today"""
    try:
        current_user_id = int(get_jwt_identity())
        today = datetime.utcnow().date()
        
        # Get questions due for review today
        reviews_due = db.session.query(UserQuestion, Question).join(
            Question, UserQuestion.question_id == Question.question_id
        ).filter(
            UserQuestion.user_id == current_user_id,
            UserQuestion.next_review != None,
            db.func.date(UserQuestion.next_review) <= today
        ).order_by(UserQuestion.next_review.asc()).all()
        
        review_data = []
        for user_question, question in reviews_due:
            review_data.append({
                'user_question_id': user_question.user_question_id,
                'question_id': question.question_id,
                'title': question.title,
                'url': question.url,
                'difficulty': question.difficulty,
                'confidence': user_question.review_confidence,
                'times_reviewed': user_question.times_reviewed or 0,
                'last_reviewed': user_question.last_reviewed.isoformat() if user_question.last_reviewed else None,
                'next_review': user_question.next_review.isoformat() if user_question.next_review else None
            })
        
        return jsonify({
            'status': 'success',
            'data': {
                'reviews': review_data,
                'count': len(review_data)
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting today's reviews: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve today\'s reviews'
        }), 500

@auth.route('/user/dashboard/summary', methods=['GET'])
@jwt_required()
def get_dashboard_summary():
    """Get summary for user dashboard/home page"""
    try:
        current_user_id = int(get_jwt_identity())
        today = datetime.utcnow().date()
        
        # Count questions needing rating
        questions_needing_rating = UserQuestion.query.filter_by(
            user_id=current_user_id,
            needs_rating=True
        ).count()
        
        # Count reviews due today
        reviews_due_today = UserQuestion.query.filter(
            UserQuestion.user_id == current_user_id,
            UserQuestion.next_review != None,
            db.func.date(UserQuestion.next_review) <= today
        ).count()
        
        # Get user's active learning paths (for new questions)
        active_paths = UserLearningPath.query.filter_by(
            user_id=current_user_id,
            is_active=True
        ).count()
        
        # Calculate new questions available (simplified for now)
        new_questions_available = Config.NEW_QUESTIONS_PER_DAY if active_paths > 0 else 0
        
        return jsonify({
            'status': 'success',
            'data': {
                'questions_needing_rating': questions_needing_rating,
                'reviews_due_today': reviews_due_today,
                'new_questions_available': new_questions_available,
                'active_learning_paths': active_paths
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting dashboard summary: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve dashboard summary'
        }), 500

@auth.route('/user/questions/<int:user_question_id>/complete-review', methods=['POST'])
@jwt_required()
def complete_review(user_question_id):
    """Complete a review and potentially reschedule"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        user_question = UserQuestion.query.filter_by(
            user_question_id=user_question_id,
            user_id=current_user_id
        ).first()
        
        if not user_question:
            return jsonify({
                'status': 'error',
                'message': 'Question not found or access denied'
            }), 404
        
        # If user provides new confidence level, update it
        if data and 'confidence' in data:
            confidence = data['confidence']
            valid_levels = [level['value'] for level in Config.REVIEW_CONFIDENCE_LEVELS]
            
            if confidence in valid_levels:
                user_question.set_review_confidence(confidence)
            else:
                return jsonify({
                    'status': 'error',
                    'message': f'Invalid confidence level. Must be one of: {valid_levels}'
                }), 400
        else:
            # Just mark as reviewed without changing confidence
            user_question.last_reviewed = datetime.utcnow()
        
        # Add optional notes
        if data and data.get('notes'):
            user_question.review_notes = data['notes']
        
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Review completed successfully',
            'data': {
                'next_review': user_question.next_review.isoformat() if user_question.next_review else None,
                'confidence': user_question.review_confidence
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error completing review for question {user_question_id}: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to complete review'
        }), 500

@auth.route('/user/recent-submissions/need-rating', methods=['GET'])
@jwt_required()
def get_recent_submissions_need_rating():
    """Get recent submissions that need confidence rating"""
    try:
        current_user_id = int(get_jwt_identity())
        
        # Get user to fetch LeetCode username
        user = User.query.get(current_user_id)
        if not user or not user.leetcode_username:
            return jsonify({
                'status': 'error',
                'message': 'No LeetCode username associated with this account'
            }), 400
        
        # Get recent submissions from LeetCode API
        leetcode_client = LeetCodeGraphQLClient()
        profile_data = leetcode_client.get_user_profile(user.leetcode_username)
        
        if 'error' in profile_data:
            return jsonify({
                'status': 'error',
                'message': f'Failed to fetch LeetCode data: {profile_data["error"]}'
            }), 400
        
        recent_submissions = profile_data.get('recentSubmissions', [])
        
        # Get unique accepted submissions (deduplicate by titleSlug)
        accepted_submissions = {}
        for submission in recent_submissions:
            if submission.get('statusDisplay', '').lower() in ['accepted', 'ac']:
                title_slug = submission.get('titleSlug')
                if title_slug and title_slug not in accepted_submissions:
                    accepted_submissions[title_slug] = submission
        
        # Cross-reference with our database to find questions that need rating
        submissions_needing_rating = []
        
        # Get all questions to match by URL (more efficient than individual queries)
        all_questions = Question.query.all()
        
        for title_slug, submission in accepted_submissions.items():
            # Check if question exists in our database by matching title slug from URL
            question = None
            
            for q in all_questions:
                if q.url:
                    db_title_slug = extract_title_slug_from_url(q.url)
                    if db_title_slug == title_slug:
                        question = q
                        break
            
            if question:
                # Check if user has already rated this question
                user_question = UserQuestion.query.filter_by(
                    user_id=current_user_id,
                    question_id=question.question_id
                ).first()
                
                # Include if: no UserQuestion exists OR UserQuestion exists but needs rating
                if not user_question or (user_question.needs_rating and not user_question.review_confidence):
                    # Create UserQuestion if it doesn't exist
                    if not user_question:
                        user_question = UserQuestion(
                            user_id=current_user_id,
                            question_id=question.question_id,
                            solved_at=datetime.fromtimestamp(int(submission.get('timestamp', 0))),
                            needs_rating=True,
                            review_confidence=None
                        )
                        db.session.add(user_question)
                        db.session.flush()  # Get the ID without committing
                    
                    submissions_needing_rating.append({
                        'user_question_id': user_question.user_question_id,
                        'question_id': question.question_id,
                        'title': submission.get('title', question.title),
                        'title_slug': title_slug,
                        'url': question.url,
                        'difficulty': question.difficulty,
                        'solved_at': datetime.fromtimestamp(int(submission.get('timestamp', 0))).isoformat(),
                        'language': submission.get('lang', 'Unknown'),
                        'leetcode_submission': {
                            'status': submission.get('statusDisplay', 'Unknown'),
                            'timestamp': submission.get('timestamp', 0),
                            'date': datetime.fromtimestamp(int(submission.get('timestamp', 0))).strftime('%Y-%m-%d %H:%M')
                        }
                    })
        
        # Commit any new UserQuestion records
        db.session.commit()
        
        # Sort by most recent first
        submissions_needing_rating.sort(key=lambda x: x['leetcode_submission']['timestamp'], reverse=True)
        
        return jsonify({
            'status': 'success',
            'data': {
                'submissions': submissions_needing_rating,
                'count': len(submissions_needing_rating),
                'confidence_levels': Config.REVIEW_CONFIDENCE_LEVELS
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error getting recent submissions needing rating: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to retrieve recent submissions needing rating'
        }), 500

@auth.route('/user/settings', methods=['PUT'])
@jwt_required()
def update_user_settings():
    """Update user settings"""
    try:
        current_user_id = int(get_jwt_identity())
        data = request.get_json()
        
        if not data:
            return jsonify({
                'status': 'error',
                'message': 'No data provided'
            }), 400
        
        # Get current user
        user = User.query.get(current_user_id)
        if not user:
            return jsonify({
                'status': 'error',
                'message': 'User not found'
            }), 404
        
        # Update leetcode_username if provided
        if 'leetcode_username' in data:
            new_username = data['leetcode_username'].strip() if data['leetcode_username'] else None
            
            # Validate username is not empty
            if new_username is not None and not new_username:
                return jsonify({
                    'status': 'error',
                    'message': 'LeetCode username cannot be empty'
                }), 400
            
            # Check if username is already taken by another user
            if new_username:
                existing_user = User.query.filter(
                    User.leetcode_username == new_username,
                    User.user_id != current_user_id
                ).first()
                
                if existing_user:
                    return jsonify({
                        'status': 'error',
                        'message': 'This LeetCode username is already associated with another account'
                    }), 409
            
            # Update the username
            user.leetcode_username = new_username
        
        # Commit changes
        db.session.commit()
        
        return jsonify({
            'status': 'success',
            'message': 'Settings updated successfully',
            'data': {
                'leetcode_username': user.leetcode_username
            }
        }), 200
        
    except Exception as e:
        logger.error(f"Error updating user settings: {str(e)}")
        db.session.rollback()
        return jsonify({
            'status': 'error',
            'message': 'Failed to update settings'
        }), 500 