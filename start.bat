@echo off
echo ========================================
echo  PERKESO Kertas Kerja - Startup Script
echo ========================================
echo.

REM Check if Docker is running
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)

REM Start PostgreSQL if not running
docker ps | findstr perkeso-postgres >nul 2>&1
if errorlevel 1 (
    echo [INFO] Starting PostgreSQL database...
    docker-compose up -d
) else (
    echo [OK] PostgreSQL is already running
)

REM Create uploads folder if not exists
if not exist "server\uploads" mkdir "server\uploads"
echo [OK] Uploads folder ready

REM Start Backend Server
echo.
echo [INFO] Starting backend server on http://localhost:5000...
start "PERKESO Backend" cmd /k "cd server && node index.js"
timeout /t 3 /nobreak >nul

REM Start Frontend Dev Server
echo [INFO] Starting frontend dev server on http://localhost:5173...
start "PERKESO Frontend" cmd /k "cd app && npx vite"

echo.
echo ========================================
echo  All services started successfully!
echo ========================================
echo.
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo  Database: localhost:5432
echo.
echo  Press any key to exit this window...
pause >nul
