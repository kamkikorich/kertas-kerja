# Deployment Automation Script for PERKESO Kertas Kerja
# Target: http://waju.my:8000

param(
    [string]$DeploymentUrl = "http://waju.my:8000/project/hh4e2e341994xyzs3edeawy9/environment/nbttnnpavs20a574gpnsdz8k",
    [switch]$BuildOnly,
    [switch]$Verify
)

$ErrorActionPreference = "Stop"

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "PERKESO Kertas Kerja - Deployment" -ForegroundColor Cyan
Write-Host "Target: $DeploymentUrl" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Function: Check prerequisites
function Test-Prerequisites {
    Write-Host "[CHECK] Verifying prerequisites..." -ForegroundColor Yellow
    
    # Check Docker
    try {
        $dockerStatus = docker ps --format "{{.Names}}" 2>$null
        if ($LASTEXITCODE -ne 0) {
            throw "Docker is not running"
        }
        Write-Host "[OK] Docker is running" -ForegroundColor Green
    } catch {
        Write-Host "[ERROR] $_" -ForegroundColor Red
        return $false
    }
    
    # Check Node.js
    try {
        $nodeVersion = node --version 2>$null
        Write-Host "[OK] Node.js: $nodeVersion" -ForegroundColor Green
    } catch {
        Write-Host "[WARNING] Node.js not found (required for local testing)" -ForegroundColor Yellow
    }
    
    return $true
}

# Function: Build Docker images
function Invoke-Build {
    Write-Host ""
    Write-Host "[BUILD] Building Docker images..." -ForegroundColor Yellow
    
    docker-compose build
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Build failed" -ForegroundColor Red
        return $false
    }
    
    Write-Host "[OK] Build successful" -ForegroundColor Green
    return $true
}

# Function: Start services
function Start-Services {
    Write-Host ""
    Write-Host "[DEPLOY] Starting services..." -ForegroundColor Yellow
    
    docker-compose up -d
    
    if ($LASTEXITCODE -ne 0) {
        Write-Host "[ERROR] Failed to start services" -ForegroundColor Red
        return $false
    }
    
    Write-Host "[OK] Services started" -ForegroundColor Green
    return $true
}

# Function: Verify deployment
function Invoke-Verify {
    Write-Host ""
    Write-Host "[VERIFY] Checking service health..." -ForegroundColor Yellow
    
    # Wait for services
    Start-Sleep -Seconds 10
    
    # Check database
    Write-Host "  Checking database..." -NoNewline
    $dbCheck = docker exec perkeso-postgres pg_isready -U postgres 2>$null
    if ($dbCheck -match "accepting connections") {
        Write-Host " OK" -ForegroundColor Green
    } else {
        Write-Host " FAILED" -ForegroundColor Red
    }
    
    # Check backend
    Write-Host "  Checking backend..." -NoNewline
    try {
        $response = Invoke-WebRequest -Uri "http://localhost:5000/api/proposals" -TimeoutSec 5 -UseBasicParsing
        if ($response.StatusCode -eq 200) {
            Write-Host " OK (HTTP $($response.StatusCode))" -ForegroundColor Green
        }
    } catch {
        Write-Host " FAILED" -ForegroundColor Red
    }
    
    # Show container status
    Write-Host ""
    Write-Host "Container Status:" -ForegroundColor Cyan
    docker-compose ps
}

# Function: Export for production
function Export-ForProduction {
    Write-Host ""
    Write-Host "[EXPORT] Preparing production package..." -ForegroundColor Yellow
    
    $exportDir = ".\deploy-package"
    if (Test-Path $exportDir) {
        Remove-Item $exportDir -Recurse -Force
    }
    New-Item -ItemType Directory -Path $exportDir | Out-Null
    
    # Copy necessary files
    Copy-Item -Path "docker-compose.yml" -Destination $exportDir
    Copy-Item -Path ".env.production" -Destination "$exportDir\.env"
    Copy-Item -Path "server" -Destination "$exportDir\server" -Recurse
    Copy-Item -Path "app" -Destination "$exportDir\app" -Recurse
    
    Write-Host "[OK] Package created at: $exportDir" -ForegroundColor Green
    Write-Host ""
    Write-Host "To deploy to waju.my:" -ForegroundColor Cyan
    Write-Host "1. Upload the deploy-package folder to your platform" -ForegroundColor White
    Write-Host "2. Or use docker save to export images:" -ForegroundColor White
    Write-Host "   docker save perkeso-backend perkeso-frontend perkeso-postgres -o perkeso-images.tar" -ForegroundColor Gray
}

# Main execution
$prereqOk = Test-Prerequisites

if (-not $prereqOk) {
    Write-Host ""
    Write-Host "Deployment aborted due to failed prerequisites." -ForegroundColor Red
    exit 1
}

if ($Verify) {
    Invoke-Verify
    exit 0
}

if ($BuildOnly) {
    Invoke-Build
    exit 0
}

# Full deployment
$buildOk = Invoke-Build
if (-not $buildOk) {
    exit 1
}

Start-Services
Invoke-Verify
Export-ForProduction

Write-Host ""
Write-Host "========================================" -ForegroundColor Cyan
Write-Host "Deployment preparation complete!" -ForegroundColor Green
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""
Write-Host "Local URLs:" -ForegroundColor Cyan
Write-Host "  Frontend: http://localhost:5173" -ForegroundColor White
Write-Host "  Backend:  http://localhost:5000" -ForegroundColor White
Write-Host "  Database: localhost:5432" -ForegroundColor White
Write-Host ""
Write-Host "Production Target: $DeploymentUrl" -ForegroundColor Cyan
Write-Host ""
