# Deployment Guide - PERKESO Kertas Kerja

## ✅ Backend Verification Status

Backend code telah disahkan **BENAR** dan sepadan dengan GitHub repository:
- ✅ `server/index.js` - Express API server
- ✅ `server/db.js` - PostgreSQL connection
- ✅ `server/.env` - Environment configuration
- ✅ All dependencies installed

## 🚀 Deployment Options

### Option 1: Docker Compose (Recommended for Production)

```bash
# 1. Copy production env file
cp .env.production .env

# 2. Edit .env with your production values:
#    - POSTGRES_PASSWORD (change to secure password)
#    - VITE_API_URL (set to production backend URL)

# 3. Build and start all services
docker-compose up -d --build

# 4. Verify containers
docker-compose ps

# 5. Check logs
docker-compose logs -f backend
```

**Services will be available at:**
- Frontend: http://localhost:3000
- Backend API: http://localhost:5000
- PostgreSQL: localhost:5432

### Option 2: Manual Deployment

#### Step 1: Database Setup
```bash
docker-compose up -d postgres
```

#### Step 2: Backend Deployment
```bash
cd server
npm install --production
node index.js
```

#### Step 3: Frontend Deployment
```bash
cd app
npm install
npm run build
npm run preview
```

## 🔧 Production Environment Configuration

Edit `.env` file with your production values:

```env
# Database
POSTGRES_USER=postgres
POSTGRES_PASSWORD=<YOUR_SECURE_PASSWORD>
POSTGRES_DB=perkeso_db
POSTGRES_PORT=5432

# Backend
DB_SSL=false
BACKEND_PORT=5000

# Frontend
FRONTEND_PORT=3000
VITE_API_URL=http://your-domain.com:5000
```

## 📊 Health Checks

```bash
# Check backend health
curl http://localhost:5000/api/proposals

# Check database connection
docker exec perkeso-postgres pg_isready -U postgres

# View backend logs
docker logs perkeso-backend
```

## 🐛 Troubleshooting

### Backend won't start
```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Check database connection
docker logs perkeso-postgres
```

### Database connection error
```bash
# Restart all services
docker-compose down
docker-compose up -d
```

## 📁 Files Created for Deployment

- `server/Dockerfile` - Backend container
- `app/Dockerfile` - Frontend container
- `app/nginx.conf` - Nginx configuration
- `docker-compose.yml` - Multi-service orchestration
- `.env.production` - Production environment template

---
Generated: 2026-04-29
