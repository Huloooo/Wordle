#!/bin/bash

# Start the backend server
cd backend
source venv/bin/activate
python app.py &
BACKEND_PID=$!

# Start the frontend server
cd ../frontend
npm start &
FRONTEND_PID=$!

# Wait for both processes
wait $BACKEND_PID $FRONTEND_PID 