@echo off
echo ========================================
echo  PERKESO Kertas Kerja - Verification
echo ========================================
echo.

REM Check Database
echo [INFO] Checking database connection...
docker exec perkeso-postgres pg_isready -U postgres >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Database is not running
) else (
    echo [OK] Database is running
)

REM Check Backend
echo [INFO] Checking backend server...
curl -s http://localhost:5000/api/proposals >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Backend is not responding
) else (
    echo [OK] Backend is running on http://localhost:5000
)

REM Check Frontend
echo [INFO] Checking frontend server...
curl -s http://localhost:5173 >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Frontend is not responding
) else (
    echo [OK] Frontend is running on http://localhost:5173
)

echo.
echo ========================================
echo  Verification Complete
echo ========================================
echo.
pause
