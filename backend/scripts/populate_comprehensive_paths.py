#!/usr/bin/env python3
"""
Comprehensive Learning Paths Population Script

This script creates all the learning paths for the enhanced LeetTrack system:
- Company-specific paths (Amazon, Meta, Uber)
- Topic-specific paths (Binary Search, DP, Graphs)
- Pattern-based paths (LeetCode 101, Grokking Interview)

Run this script after setting up the database to populate with curated content.
"""

import os
import sys
import requests
import time
from datetime import datetime

# Add the parent directory to the Python path to import app modules
sys.path.append(os.path.dirname(os.path.dirname(os.path.abspath(__file__))))

from app import create_app, db
from app.models.user import User
from app.models.learning_path import LearningPath
from app.models.question import Question
from app.models.path_question import PathQuestion
from app.utils.learning_paths import (
    create_company_paths,
    create_topic_paths, 
    create_pattern_paths
)

def get_or_create_admin_user():
    """Get or create an admin user for system path creation"""
    admin = User.query.filter_by(email='admin@leettrack.com').first()
    
    if not admin:
        admin = User(
            username='system_admin',
            email='admin@leettrack.com',
            is_admin=True
        )
        admin.set_password('LeetTrack2024!')  # Change this in production
        db.session.add(admin)
        db.session.commit()
        print(f"✅ Created admin user: {admin.email}")
    else:
        print(f"✅ Found existing admin user: {admin.email}")
    
    return admin

def check_existing_paths():
    """Check if system paths already exist"""
    existing_paths = LearningPath.query.filter_by(source='System').all()
    if existing_paths:
        print(f"⚠️  Found {len(existing_paths)} existing system paths:")
        for path in existing_paths:
            print(f"   - {path.name}")
        
        response = input("\nDo you want to continue? This may create duplicates. (y/N): ")
        if response.lower() != 'y':
            print("❌ Aborted by user")
            return False
    
    return True

def populate_all_paths():
    """Main function to populate all learning paths"""
    print("🚀 Starting comprehensive learning paths population...")
    print("=" * 60)
    
    app = create_app()
    
    with app.app_context():
        try:
            # Check for existing paths
            if not check_existing_paths():
                return
            
            # Get or create admin user
            admin = get_or_create_admin_user()
            
            print(f"\n📚 Creating learning paths...")
            print("-" * 40)
            
            total_created = 0
            
            # Create company-specific paths
            print("\n🏢 Creating company-specific paths...")
            try:
                company_paths = create_company_paths(admin.user_id)
                total_created += len(company_paths)
                print(f"✅ Created {len(company_paths)} company paths:")
                for path in company_paths:
                    questions_count = PathQuestion.query.filter_by(path_id=path.path_id).count()
                    print(f"   - {path.name} ({questions_count} questions)")
            except Exception as e:
                print(f"❌ Error creating company paths: {e}")
            
            # Create topic-specific paths
            print("\n📖 Creating topic-specific paths...")
            try:
                topic_paths = create_topic_paths(admin.user_id)
                total_created += len(topic_paths)
                print(f"✅ Created {len(topic_paths)} topic paths:")
                for path in topic_paths:
                    questions_count = PathQuestion.query.filter_by(path_id=path.path_id).count()
                    print(f"   - {path.name} ({questions_count} questions)")
            except Exception as e:
                print(f"❌ Error creating topic paths: {e}")
            
            # Create pattern-based paths
            print("\n🎯 Creating pattern-based paths...")
            try:
                pattern_paths = create_pattern_paths(admin.user_id)
                total_created += len(pattern_paths)
                print(f"✅ Created {len(pattern_paths)} pattern paths:")
                for path in pattern_paths:
                    questions_count = PathQuestion.query.filter_by(path_id=path.path_id).count()
                    print(f"   - {path.name} ({questions_count} questions)")
            except Exception as e:
                print(f"❌ Error creating pattern paths: {e}")
            
            print("\n" + "=" * 60)
            print(f"🎉 Successfully populated {total_created} learning paths!")
            
            # Summary statistics
            print(f"\n📊 Final Statistics:")
            print(f"   - Total Learning Paths: {LearningPath.query.count()}")
            print(f"   - System Paths: {LearningPath.query.filter_by(source='System').count()}")
            print(f"   - Total Questions in Database: {Question.query.count()}")
            print(f"   - Total Path-Question Associations: {PathQuestion.query.count()}")
            
            # Paths by difficulty
            for difficulty in ['Beginner', 'Intermediate', 'Advanced']:
                count = LearningPath.query.filter_by(difficulty_level=difficulty).count()
                print(f"   - {difficulty} Paths: {count}")
            
            print(f"\n✅ All done! Database populated at {datetime.now()}")
            
        except Exception as e:
            print(f"❌ Error during population: {e}")
            db.session.rollback()
            return False
    
    return True

def verify_paths():
    """Verify that paths were created correctly"""
    print("\n🔍 Verifying created paths...")
    
    app = create_app()
    with app.app_context():
        paths = LearningPath.query.filter_by(source='System').all()
        
        for path in paths:
            questions = PathQuestion.query.filter_by(path_id=path.path_id).count()
            print(f"   {path.name}: {questions} questions")
            
            if questions == 0:
                print(f"   ⚠️  WARNING: {path.name} has no questions!")

def main():
    """Main entry point"""
    print("🎯 LeetTrack Comprehensive Learning Paths Population")
    print("=" * 60)
    print("This will create the following learning paths:")
    print("\n🏢 Company Paths:")
    print("   - Amazon Interview Prep - 30 Days")
    print("   - Meta Interview Prep - 30 Days") 
    print("   - Uber Interview Prep - 30 Days")
    print("\n📖 Topic Paths:")
    print("   - Binary Search Mastery")
    print("   - Dynamic Programming Deep Dive")
    print("   - Graph Algorithms Complete Guide")
    print("\n🎯 Pattern Paths:")
    print("   - LeetCode 101 - Algorithm Patterns")
    print("   - Grokking the Coding Interview Patterns")
    print("\n" + "=" * 60)
    
    response = input("Do you want to proceed? (y/N): ")
    if response.lower() != 'y':
        print("❌ Aborted by user")
        return
    
    success = populate_all_paths()
    
    if success:
        verify_paths()
        print("\n🎉 Population completed successfully!")
        print("\n💡 Next steps:")
        print("   1. Start your Flask development server")
        print("   2. Log in as admin (admin@leettrack.com / LeetTrack2024!)")
        print("   3. Visit /admin to manage learning paths")
        print("   4. Users can now enroll in these comprehensive learning paths")
    else:
        print("\n❌ Population failed. Check the error messages above.")

if __name__ == "__main__":
    main() 