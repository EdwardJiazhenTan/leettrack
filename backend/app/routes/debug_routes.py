from flask import Blueprint, jsonify
from app.models.user import User
from app.models.question import Question
from app.models.user_question import UserQuestion
from app.models.review_schedule import ReviewSchedule
from app.models.scheduled_review import ScheduledReview
from app.models.learning_path import LearningPath
from app.models.path_question import PathQuestion
from app.models.user_learning_path import UserLearningPath
from app.models.user_path_question import UserPathQuestion
from app.utils.security import admin_required
from app import db
import logging

logger = logging.getLogger(__name__)

debug = Blueprint('debug', __name__, url_prefix='/api/v1/debug')

@debug.route('/all-data', methods=['GET'])
@admin_required
def get_all_data():
    """Get all data from all database tables for testing purposes"""
    try:
        # Fetch all data from each table
        users = User.query.all()
        questions = Question.query.all()
        user_questions = UserQuestion.query.all()
        review_schedules = ReviewSchedule.query.all()
        scheduled_reviews = ScheduledReview.query.all()
        learning_paths = LearningPath.query.all()
        path_questions = PathQuestion.query.all()
        user_learning_paths = UserLearningPath.query.all()
        user_path_questions = UserPathQuestion.query.all()

        # Convert to dictionaries
        data = {
            'users': [
                {
                    'user_id': u.user_id,
                    'email': u.email,
                    'leetcode_username': u.leetcode_username,
                    'created_at': u.created_at.isoformat() if u.created_at else None,
                    'last_login': u.last_login.isoformat() if u.last_login else None,
                    'is_active': u.is_active
                } for u in users
            ],
            'questions': [
                {
                    'question_id': q.question_id,
                    'leetcode_id': q.leetcode_id,
                    'title': q.title,
                    'url': q.url,
                    'difficulty': q.difficulty,
                    'description': q.description,
                    'tags': q.tags,
                    'acceptance_rate': q.acceptance_rate,
                    'frequency': q.frequency,
                    'last_updated': q.last_updated.isoformat() if q.last_updated else None
                } for q in questions
            ],
            'user_questions': [
                {
                    'user_question_id': uq.user_question_id,
                    'user_id': uq.user_id,
                    'question_id': uq.question_id,
                    'review_rating': uq.review_rating,
                    'solved_at': uq.solved_at.isoformat() if uq.solved_at else None,
                    'last_reviewed': uq.last_reviewed.isoformat() if uq.last_reviewed else None,
                    'next_review': uq.next_review.isoformat() if uq.next_review else None,
                    'times_reviewed': uq.times_reviewed,
                    'review_notes': uq.review_notes
                } for uq in user_questions
            ],
            'review_schedules': [
                {
                    'schedule_id': rs.schedule_id,
                    'user_id': rs.user_id,
                    'review_date': rs.review_date.isoformat() if rs.review_date else None,
                    'is_completed': rs.is_completed
                } for rs in review_schedules
            ],
            'scheduled_reviews': [
                {
                    'scheduled_review_id': sr.scheduled_review_id,
                    'schedule_id': sr.schedule_id,
                    'user_question_id': sr.user_question_id,
                    'is_reviewed': sr.is_reviewed,
                    'reviewed_at': sr.reviewed_at.isoformat() if sr.reviewed_at else None,
                    'new_rating': sr.new_rating
                } for sr in scheduled_reviews
            ],
            'learning_paths': [
                {
                    'path_id': lp.path_id,
                    'name': lp.name,
                    'description': lp.description,
                    'source': lp.source,
                    'creator_id': lp.creator_id,
                    'is_public': lp.is_public,
                    'difficulty_level': lp.difficulty_level,
                    'estimated_hours': lp.estimated_hours,
                    'tags': lp.tags,
                    'created_at': lp.created_at.isoformat() if lp.created_at else None,
                    'updated_at': lp.updated_at.isoformat() if lp.updated_at else None,
                    'is_active': lp.is_active
                } for lp in learning_paths
            ],
            'path_questions': [
                {
                    'path_question_id': pq.path_question_id,
                    'path_id': pq.path_id,
                    'question_id': pq.question_id,
                    'sequence_number': pq.sequence_number,
                    'notes': pq.notes,
                    'estimated_minutes': pq.estimated_minutes,
                    'importance': pq.importance
                } for pq in path_questions
            ],
            'user_learning_paths': [
                {
                    'user_path_id': ulp.user_path_id,
                    'user_id': ulp.user_id,
                    'path_id': ulp.path_id,
                    'started_at': ulp.started_at.isoformat() if ulp.started_at else None,
                    'completed_at': ulp.completed_at.isoformat() if ulp.completed_at else None,
                    'is_active': ulp.is_active,
                    'completion_percentage': ulp.completion_percentage
                } for ulp in user_learning_paths
            ],
            'user_path_questions': [
                {
                    'user_path_question_id': upq.user_path_question_id,
                    'user_path_id': upq.user_path_id,
                    'path_question_id': upq.path_question_id,
                    'is_completed': upq.is_completed,
                    'completed_at': upq.completed_at.isoformat() if upq.completed_at else None
                } for upq in user_path_questions
            ]
        }

        # Add summary statistics
        summary = {
            'total_users': len(users),
            'total_questions': len(questions),
            'total_user_questions': len(user_questions),
            'total_review_schedules': len(review_schedules),
            'total_scheduled_reviews': len(scheduled_reviews),
            'total_learning_paths': len(learning_paths),
            'total_path_questions': len(path_questions),
            'total_user_learning_paths': len(user_learning_paths),
            'total_user_path_questions': len(user_path_questions)
        }

        return jsonify({
            'status': 'success',
            'message': 'All database data retrieved successfully',
            'summary': summary,
            'data': data
        }), 200

    except Exception as e:
        logger.error(f"Error fetching all database data: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred while fetching database data: {str(e)}'
        }), 500

@debug.route('/tables', methods=['GET'])
@admin_required
def get_table_info():
    """Get information about all database tables"""
    try:
        # Get table names and row counts
        tables_info = []
        
        models = [
            ('users', User),
            ('questions', Question),
            ('user_questions', UserQuestion),
            ('review_schedule', ReviewSchedule),
            ('scheduled_reviews', ScheduledReview),
            ('learning_paths', LearningPath),
            ('path_questions', PathQuestion),
            ('user_learning_paths', UserLearningPath),
            ('user_path_questions', UserPathQuestion)
        ]
        
        for table_name, model in models:
            try:
                count = model.query.count()
                tables_info.append({
                    'table_name': table_name,
                    'row_count': count
                })
            except Exception as e:
                logger.error(f"Error counting {table_name}: {str(e)}")
                tables_info.append({
                    'table_name': table_name,
                    'row_count': 0,
                    'error': str(e)
                })
        
        return jsonify({
            'status': 'success',
            'message': 'Database table information retrieved successfully',
            'tables': tables_info
        }), 200

    except Exception as e:
        logger.error(f"Error fetching table info: {str(e)}")
        return jsonify({
            'status': 'error',
            'message': f'An error occurred while fetching table info: {str(e)}'
        }), 500 