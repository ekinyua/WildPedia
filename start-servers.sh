#!/bin/bash

FRONTEND_DIR="./frontend"
AUTH_SERVER_DIR="./backend"
QUIZ_SERVER_DIR="./AI_quiz_generator"

function is_port_in_use() {
  lsof -i:"$1" -t >/dev/null 2>&1
}

# Function to start a service in its directory
start_service() {
  local dir=$1
  local name=$2
  
  echo "Starting $name in $dir..."
  cd "$dir" || { echo "Error: Directory $dir not found"; exit 1; }
  
  # Start the npm process in background
  npm run dev &
  
  # Save the process ID
  local pid=$!
  echo "$name started with PID: $pid"
  
  # Return to original directory
  cd - > /dev/null
  
  # Add small delay to let process initialize
  sleep 2
}

# Clear the terminal
clear
echo "===== Starting All Services ====="

# Check for existing processes on common ports (3000, 5000, 3001)
if is_port_in_use 5173; then
  echo "Warning: Port 5173 is already in use. Frontend may not start correctly."
fi

if is_port_in_use 5000; then
  echo "Warning: Port 5000 is already in use. Auth server may not start correctly."
fi

if is_port_in_use 3000; then
  echo "Warning: Port 3001 is already in use. Quiz server may not start correctly."
fi

# Start all services
start_service "$FRONTEND_DIR" "React Frontend"
start_service "$AUTH_SERVER_DIR" "Auth Server"
start_service "$QUIZ_SERVER_DIR" "Quiz Server"

echo -e "\nAll services started successfully!"
echo "Press Ctrl+C to stop all services"

# Wait for user to press Ctrl+C
wait