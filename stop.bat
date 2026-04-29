@echo off
echo ========================================
echo  PERKESO Kertas Kerja - Stop Script
echo ========================================
echo.

REM Stop Docker container
echo [INFO] Stopping PostgreSQL database...
docker-compose down
echo [OK] Database stopped

REM Kill node processes
echo [INFO] Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
echo [OK] Node.js processes stopped

echo.
echo ========================================
echo  All services stopped successfully!
echo ========================================
echo.
pause
