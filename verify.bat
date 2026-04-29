@echo off
echo ========================================
echo  PERKESO Kertas Kerja - System Check
echo ========================================
echo.

REM Check Docker
docker ps | findstr perkeso-postgres >nul 2>&1
if errorlevel 1 (
    echo [FAIL] PostgreSQL is NOT running
) else (
    echo [OK]   PostgreSQL is running
)

REM Check Backend Port
netstat -ano | findstr ":5000" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Backend (port 5000) is NOT running
) else (
    echo [OK]   Backend is running on port 5000
)

REM Check Frontend Port
netstat -ano | findstr ":5173" >nul 2>&1
if errorlevel 1 (
    echo [FAIL] Frontend (port 5173) is NOT running
) else (
    echo [OK]   Frontend is running on port 5173
)

REM Check node_modules
if not exist "app\node_modules" (
    echo [FAIL] App dependencies NOT installed
) else (
    echo [OK]   App dependencies installed
)

if not exist "server\node_modules" (
    echo [FAIL] Server dependencies NOT installed
) else (
    echo [OK]   Server dependencies installed
)

REM Check .env file
if not exist "server\.env" (
    echo [FAIL] Server .env file NOT found
) else (
    echo [OK]   Server .env file exists
)

REM Check uploads folder
if not exist "server\uploads" (
    echo [WARN] Uploads folder will be auto-created
) else (
    echo [OK]   Uploads folder exists
)

echo.
echo ========================================
echo  Access the application at:
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000/api/proposals
echo ========================================
echo.
pause
