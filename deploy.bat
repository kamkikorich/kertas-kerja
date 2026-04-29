@echo off
setlocal enabledelayedexpansion

echo ========================================
echo  PERKESO Kertas Kerja - Deploy to Production
echo  Target: http://waju.my:8000
echo ========================================
echo.

REM Configuration
set DEPLOYMENT_URL=http://waju.my:8000/project/hh4e2e341994xyzs3edeawy9/environment/nbttnnpavs20a574gpnsdz8k
set BACKEND_PORT=5000

REM Step 1: Verify Docker is running
echo [STEP 1/5] Checking Docker...
docker ps >nul 2>&1
if errorlevel 1 (
    echo [ERROR] Docker is not running. Please start Docker Desktop first.
    pause
    exit /b 1
)
echo [OK] Docker is running
echo.

REM Step 2: Build and start services
echo [STEP 2/5] Building and starting services...
docker-compose down >nul 2>&1
docker-compose up -d --build
if errorlevel 1 (
    echo [ERROR] Failed to build services
    pause
    exit /b 1
)
echo [OK] Services built successfully
echo.

REM Step 3: Wait for services to be ready
echo [STEP 3/5] Waiting for services to be ready...
timeout /t 10 /nobreak >nul

REM Step 4: Verify backend health
echo [STEP 4/5] Verifying backend health...
curl -s http://localhost:5000/api/proposals >nul 2>&1
if errorlevel 1 (
    echo [WARNING] Backend may not be fully ready yet, checking logs...
    docker logs perkeso-backend --tail 20
) else (
    echo [OK] Backend is responding
)
echo.

REM Step 5: Display deployment info
echo [STEP 5/5] Deployment Summary
echo ========================================
echo  Local Backend:  http://localhost:%BACKEND_PORT%
echo  Local Frontend: http://localhost:5173
echo  Database:       localhost:5432
echo.
echo  Production URL: %DEPLOYMENT_URL%
echo.
echo  To deploy to production, use:
echo    1. Docker push to your registry
echo    2. Or use the platform's upload feature
echo ========================================
echo.

REM Show running containers
echo Running containers:
docker-compose ps
echo.

echo Deployment preparation complete!
pause
