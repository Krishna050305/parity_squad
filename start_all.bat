@echo off
echo Starting LendPool Platform...

:: Start Algorand LocalNet in a new window
echo Starting Algorand Localnet...
start "Algorand LocalNet" cmd /k "algokit localnet start"

:: Start FastAPI Backend in a new window
echo Starting FastAPI Backend...
start "FastAPI Backend" cmd /k "python -m fastapi dev backend/main.py"

:: Start React Frontend in a new window
echo Starting React Frontend...
start "React Frontend" cmd /k "cd frontend && npm install && npm run dev"

echo All services are starting up!
