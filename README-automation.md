# 🤖 AUTOMATION SETUP - PERKESO Kertas Kerja

## 📋 Automation Scripts

### 1. start.bat - Auto-Start Script

**Purpose:** Start all services automatically with one click

**Usage:** Double-click `start.bat`

**What it does:**
1. ✅ Checks if Docker is running
2. ✅ Starts PostgreSQL database (if not running)
3. ✅ Creates uploads folder
4. ✅ Starts backend server (port 5000)
5. ✅ Starts frontend dev server (port 5173)

**Script Content:**
```batch
@echo off
echo ========================================
echo  PERKESO Kertas Kerja - Startup Script
echo ========================================

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

REM Create uploads folder
if not exist "server\uploads" mkdir "server\uploads"
echo [OK] Uploads folder ready

REM Start Backend Server
echo [INFO] Starting backend server on http://localhost:5000...
start "PERKESO Backend" cmd /k "cd server && node index.js"
timeout /t 3 /nobreak >nul

REM Start Frontend Dev Server
echo [INFO] Starting frontend dev server on http://localhost:5173...
start "PERKESO Frontend" cmd /k "cd app && npx vite"

echo ========================================
echo  All services started successfully!
echo ========================================
echo  Frontend: http://localhost:5173
echo  Backend:  http://localhost:5000
echo  Database: localhost:5432
pause >nul
```

---

### 2. stop.bat - Auto-Stop Script

**Purpose:** Stop all services cleanly

**Usage:** Double-click `stop.bat`

**What it does:**
1. ✅ Stops Docker containers
2. ✅ Kills Node.js processes

**Script Content:**
```batch
@echo off
echo ========================================
echo  PERKESO Kertas Kerja - Stop Script
echo ========================================

REM Stop Docker container
echo [INFO] Stopping PostgreSQL database...
docker-compose down
echo [OK] Database stopped

REM Kill node processes
echo [INFO] Stopping all Node.js processes...
taskkill /F /IM node.exe 2>nul
echo [OK] Node.js processes stopped

echo ========================================
echo  All services stopped successfully!
echo ========================================
pause
```

---

### 3. verify.bat - Health Check Script

**Purpose:** Verify all services are running

**Usage:** Double-click `verify.bat`

**What it does:**
1. ✅ Checks database connection
2. ✅ Tests backend API
3. ✅ Tests frontend server

**Script Content:**
```batch
@echo off
echo ========================================
echo  PERKESO Kertas Kerja - Verification
echo ========================================

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

echo ========================================
echo  Verification Complete
echo ========================================
pause
```

---

### 4. deploy.ps1 - PowerShell Deployment Script

**Purpose:** Advanced deployment with build and export options

**Usage:**
```powershell
# Full deployment
.\deploy.ps1

# Build only
.\deploy.ps1 -BuildOnly

# Verify only
.\deploy.ps1 -Verify
```

**Features:**
- ✅ Prerequisites check
- ✅ Docker image build
- ✅ Service deployment
- ✅ Health verification
- ✅ Production package export

---

## 🔧 Manual Commands

### Start Services Manually

```bash
# Start all Docker services
docker-compose up -d

# Start backend manually
cd server
node index.js

# Start frontend manually
cd app
npm run dev
```

### Stop Services Manually

```bash
# Stop all Docker services
docker-compose down

# Kill Node.js processes (Windows)
taskkill /F /IM node.exe

# Kill Node.js processes (Linux/Mac)
pkill -f node
```

### Check Service Status

```bash
# Docker containers
docker-compose ps

# Backend logs
docker logs perkeso-backend

# Frontend logs
docker logs perkeso-frontend

# Database logs
docker logs perkeso-postgres
```

### Restart Services

```bash
# Restart all
docker-compose restart

# Restart specific service
docker-compose restart backend
docker-compose restart frontend
docker-compose restart postgres
```

---

## 📊 Service Ports

| Service | Port | URL |
|---------|------|-----|
| Frontend | 5173 | http://localhost:5173 |
| Backend API | 5000 | http://localhost:5000 |
| PostgreSQL | 5432 | localhost:5432 |

---

## 🧪 Testing Automation

### Test All Services

```bash
# Run verification
.\verify.bat

# Or manually test APIs
curl http://localhost:5000/api/proposals
curl http://localhost:5173
```

### Expected Output

```
========================================
PERKESO Kertas Kerja - Verification
========================================

[INFO] Checking database connection...
[OK] Database is running

[INFO] Checking backend server...
[OK] Backend is running on http://localhost:5000

[INFO] Checking frontend server...
[OK] Frontend is running on http://localhost:5173

========================================
Verification Complete
========================================
```

---

## 🛠️ Troubleshooting Automation

### start.bat Doesn't Work

1. **Check if Docker Desktop is running**
   ```bash
   docker ps
   ```

2. **Run as Administrator**
   - Right-click `start.bat`
   - Select "Run as administrator"

3. **Check PowerShell execution policy**
   ```powershell
   Get-ExecutionPolicy
   # If Restricted, run:
   Set-ExecutionPolicy RemoteSigned -Scope CurrentUser
   ```

### Services Won't Start

1. **Check port conflicts**
   ```bash
   netstat -ano | findstr :5000
   netstat -ano | findstr :5173
   netstat -ano | findstr :5432
   ```

2. **Kill conflicting processes**
   ```bash
   taskkill /F /PID <process-id>
   ```

3. **Restart Docker Desktop**
   - Right-click Docker icon in system tray
   - Select "Restart"

### verify.bat Shows Errors

1. **Wait for services to fully start**
   - Backend takes ~5 seconds
   - Frontend takes ~10 seconds

2. **Check logs**
   ```bash
   docker logs perkeso-backend
   docker logs perkeso-frontend
   ```

---

## 📝 Best Practices

### Daily Workflow

1. **Morning: Start services**
   ```bash
   # Double-click start.bat
   ```

2. **During work: Monitor logs**
   ```bash
   docker-compose logs -f
   ```

3. **Evening: Stop services**
   ```bash
   # Double-click stop.bat
   ```

### Weekly Maintenance

1. **Check disk space**
   ```bash
   docker system df
   ```

2. **Clean up unused resources**
   ```bash
   docker system prune -a
   ```

3. **Update dependencies**
   ```bash
   cd server && npm update
   cd app && npm update
   ```

### Monthly Tasks

1. **Backup database**
   ```bash
   docker exec perkeso-postgres pg_dump -U postgres perkeso_db > backup.sql
   ```

2. **Review logs for errors**
   ```bash
   docker-compose logs --tail 1000
   ```

3. **Update Docker images**
   ```bash
   docker-compose pull
   docker-compose up -d
   ```

---

## 🎯 Quick Reference

| Task | Command |
|------|---------|
| Start all | Double-click `start.bat` |
| Stop all | Double-click `stop.bat` |
| Verify | Double-click `verify.bat` |
| View logs | `docker-compose logs -f` |
| Restart | `docker-compose restart` |
| Rebuild | `docker-compose up -d --build` |
| Clean up | `docker system prune` |
| Backup DB | `docker exec perkeso-postgres pg_dump -U postgres perkeso_db > backup.sql` |

---

**Last Updated:** 2026-04-29  
**Status:** ✅ Automation Ready
