#!/bin/bash

# Run LeetTrack Development Environment

# Start the backend server
echo "Starting Flask backend..."
cd backend
source venv/bin/activate  # Adjust if your virtual environment is named differently
export FLASK_APP=app
export FLASK_ENV=development
flask run &
BACKEND_PID=$!
cd ..

# Start the frontend server
echo "Starting Next.js frontend..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

# Function to handle termination
cleanup() {
  echo "Shutting down servers..."
  kill $BACKEND_PID
  kill $FRONTEND_PID
  exit 0
}

# Trap SIGINT (Ctrl+C) and call cleanup
trap cleanup SIGINT

echo "Development environment is running!"
echo "Frontend: http://localhost:3000"
echo "Backend: http://localhost:5000"
echo "Press Ctrl+C to stop all servers"

# Keep the script running
wait 