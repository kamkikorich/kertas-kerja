# 🚀 PANDUAN DEPLOYMENT LENGKAP - PERKESO Kertas Kerja

## 📋 Ringkasan Projek

**Nama Projek:** PERKESO Kertas Kerja  
**GitHub:** https://github.com/kamkikorich/kertas-kerja  
**Backend:** Express.js + PostgreSQL  
**Frontend:** React + Vite  
**Status:** ✅ Production Ready  

---

## 🔧 1. STRUKTUR FAIL

```
kertas-kerja/
├── app/                        # Frontend React Application
│   ├── src/
│   │   ├── App.jsx            # Main component
│   │   ├── main.jsx           # Entry point
│   │   ├── App.css            # Component styles
│   │   └── index.css          # Global styles
│   ├── dist/                  # Build output (production)
│   ├── package.json
│   ├── vite.config.js
│   ├── Dockerfile             # ⭐ Frontend Docker config
│   └── nginx.conf             # ⭐ Nginx reverse proxy
│
├── server/                     # Backend Express Application
│   ├── index.js               # ⭐ Main API server
│   ├── db.js                  # ⭐ Database connection
│   ├── .env                   # ⭐ Environment variables
│   ├── .env.example           # Template
│   ├── package.json
│   ├── uploads/               # File upload directory
│   └── Dockerfile             # ⭐ Backend Docker config
│
├── docker-compose.yml          # ⭐ Multi-service orchestration
├── .env                        # ⭐ Production environment
├── .env.production             # Template production
├── start.bat                   # ⭐ Auto-start (Windows)
├── stop.bat                    # ⭐ Auto-stop (Windows)
├── verify.bat                  # ⭐ Health check
├── deploy.ps1                  # ⭐ PowerShell deployment
├── perkeso-images.tar          # ⭐ Exported Docker images
├── DEPLOYMENT_SUMMARY.md       # ⭐ Deployment guide
└── README-automation.md        # ⭐ Automation guide
```

---

## 🎯 2. KONFIGURASI BACKEND

### 2.1 Environment Variables (.env)

```env
# Database Configuration
POSTGRES_USER=postgres
POSTGRES_PASSWORD=perkeso_secure_2024
POSTGRES_DB=perkeso_db
POSTGRES_PORT=5432

# Backend Configuration
DB_SSL=false
BACKEND_PORT=5000

# Frontend Configuration
FRONTEND_PORT=5173
VITE_API_URL=http://localhost:5000
```

### 2.2 Backend Dependencies (server/package.json)

```json
{
  "dependencies": {
    "cors": "^2.8.6",
    "dotenv": "^17.4.2",
    "express": "^5.2.1",
    "multer": "^2.1.1",
    "pg": "^8.20.0"
  }
}
```

### 2.3 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/proposals` | Create new proposal |
| GET | `/api/proposals` | Get all proposals |

### 2.4 Database Schema

```sql
-- Table: proposals
CREATE TABLE proposals (
  id SERIAL PRIMARY KEY,
  tajuk TEXT,
  tarikh_tempat TEXT,
  masa TEXT,
  pengenalan TEXT,
  kehadiran TEXT,
  jenis_aktiviti TEXT,
  kumpulan_sasaran TEXT,
  penceramah TEXT,
  tentatif_program TEXT,
  kos_perbelanjaan NUMERIC,
  lain_lain_perbelanjaan NUMERIC,
  implikasi_anggota TEXT,
  roi_kuantitatif TEXT,
  disediakan_oleh TEXT,
  tarikh_disediakan TEXT,
  disemak_oleh TEXT,
  tarikh_disemak TEXT,
  bajet_disokong NUMERIC,
  kod_bajet TEXT,
  disahkan_oleh TEXT,
  tarikh_disahkan TEXT,
  diluluskan_oleh TEXT,
  tarikh_lulus TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- Table: objectives
CREATE TABLE objectives (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
  objective_text TEXT
);

-- Table: attachments
CREATE TABLE attachments (
  id SERIAL PRIMARY KEY,
  proposal_id INTEGER REFERENCES proposals(id) ON DELETE CASCADE,
  file_name TEXT,
  file_path TEXT,
  file_type TEXT,
  created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

---

## 🐳 3. DOCKER CONFIGURATION

### 3.1 Backend Dockerfile (server/Dockerfile)

```dockerfile
FROM node:18-alpine

WORKDIR /app

COPY package*.json ./

RUN npm install --production

COPY . .

EXPOSE 5000

CMD ["node", "index.js"]
```

### 3.2 Frontend Dockerfile (app/Dockerfile)

```dockerfile
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./

RUN npm install

COPY . .

RUN npm run build

FROM nginx:alpine

COPY --from=builder /app/dist /usr/share/nginx/html

COPY nginx.conf /etc/nginx/conf.d/default.conf

EXPOSE 80

CMD ["nginx", "-g", "daemon off;"]
```

### 3.3 Nginx Configuration (app/nginx.conf)

```nginx
server {
    listen 80;
    server_name localhost;
    root /usr/share/nginx/html;
    index index.html;

    location / {
        try_files $uri $uri/ /index.html;
    }

    location /api {
        proxy_pass http://backend:5000;
        proxy_http_version 1.1;
        proxy_set_header Upgrade $http_upgrade;
        proxy_set_header Connection 'upgrade';
        proxy_set_header Host $host;
        proxy_cache_bypass $http_upgrade;
    }
}
```

### 3.4 Docker Compose (docker-compose.yml)

```yaml
services:
  postgres:
    image: postgres:15-alpine
    container_name: perkeso-postgres
    environment:
      POSTGRES_USER: ${POSTGRES_USER:-postgres}
      POSTGRES_PASSWORD: ${POSTGRES_PASSWORD:?Database password required}
      POSTGRES_DB: ${POSTGRES_DB:-perkeso_db}
    ports:
      - "${POSTGRES_PORT:-5432}:5432"
    volumes:
      - pgdata:/var/lib/postgresql/data
    restart: unless-stopped
    healthcheck:
      test: ["CMD-SHELL", "pg_isready -U ${POSTGRES_USER:-postgres}"]
      interval: 10s
      timeout: 5s
      retries: 5

  backend:
    build: ./server
    container_name: perkeso-backend
    environment:
      DB_HOST: postgres
      DB_PORT: 5432
      DB_USER: ${POSTGRES_USER:-postgres}
      DB_PASSWORD: ${POSTGRES_PASSWORD:?Database password required}
      DB_NAME: ${POSTGRES_DB:-perkeso_db}
      DB_SSL: ${DB_SSL:-false}
      PORT: 5000
    ports:
      - "${BACKEND_PORT:-5000}:5000"
    depends_on:
      postgres:
        condition: service_healthy
    restart: unless-stopped
    volumes:
      - ./server/uploads:/app/uploads

  frontend:
    build: ./app
    container_name: perkeso-frontend
    environment:
      VITE_API_URL: ${VITE_API_URL:-http://localhost:5000}
    ports:
      - "${FRONTEND_PORT:-3000}:80"
    depends_on:
      - backend
    restart: unless-stopped

volumes:
  pgdata:
```

---

## 🚀 4. CARA DEPLOY

### 4.1 Local Deployment (Windows)

#### Kaedah Automatik (Disyorkan)

**Start semua services:**
```bash
# Double-click start.bat
```

**Stop semua services:**
```bash
# Double-click stop.bat
```

**Verify health:**
```bash
# Double-click verify.bat
```

#### Kaedah Manual

```bash
# 1. Start database
docker-compose up -d

# 2. Start backend (dalam terminal baru)
cd server
node index.js

# 3. Start frontend (dalam terminal baru)
cd app
npm run dev
```

### 4.2 Production Deployment (waju.my)

#### Option A: Upload Docker Images

```bash
# 1. Load exported images
docker load -i perkeso-images.tar

# 2. Copy deployment files
# - docker-compose.yml
# - .env
# - server/uploads/

# 3. Start services
docker-compose up -d
```

#### Option B: Build from Source

```bash
# 1. Clone repository
git clone https://github.com/kamkikorich/kertas-kerja.git
cd kertas-kerja

# 2. Configure environment
cp .env.production .env
# Edit .env dengan production values

# 3. Build and deploy
docker-compose up -d --build
```

#### Option C: Platform UI Deployment

1. Login ke http://waju.my:8000
2. Navigate ke project environment
3. Connect GitHub repository
4. Set environment variables dari `.env`
5. Deploy containers

---

## 🧪 5. VERIFICATION & TESTING

### 5.1 Health Checks

```bash
# Check all containers
docker-compose ps

# Expected output:
# NAME               STATUS              PORTS
# perkeso-backend    Up (healthy)        0.0.0.0:5000->5000/tcp
# perkeso-frontend   Up (healthy)        0.0.0.0:5173->80/tcp
# perkeso-postgres   Up (healthy)        0.0.0.0:5432->5432/tcp
```

### 5.2 API Testing

```bash
# Test backend API
curl http://localhost:5000/api/proposals

# Test frontend
curl http://localhost:5173

# Test database connection
docker exec perkeso-postgres pg_isready -U postgres
```

### 5.3 Logs

```bash
# View backend logs
docker logs perkeso-backend

# View frontend logs
docker logs perkeso-frontend

# View database logs
docker logs perkeso-postgres

# Follow logs in real-time
docker-compose logs -f
```

---

## 🔧 6. TROUBLESHOOTING

### 6.1 Backend Won't Start

```bash
# Check if port 5000 is in use
netstat -ano | findstr :5000

# Kill process if needed
taskkill /F /PID <process-id>

# Check logs
docker logs perkeso-backend
```

### 6.2 Database Connection Error

```bash
# Restart database
docker-compose restart postgres

# Check database logs
docker logs perkeso-postgres

# Verify connection
docker exec perkeso-postgres pg_isready -U postgres
```

### 6.3 Frontend Can't Reach Backend

```bash
# Check VITE_API_URL in .env
# Should be: http://localhost:5000 (local) or production URL

# Restart frontend
docker-compose restart frontend

# Check network
docker network ls
docker network inspect kertascadanganperkeso_default
```

### 6.4 Port Conflicts

Edit `docker-compose.yml`:

```yaml
ports:
  - "NEW_PORT:5000"  # Change host port
```

### 6.5 Reset Database

```bash
# Stop all services
docker-compose down

# Remove volumes (WARNING: deletes all data)
docker-compose down -v

# Start fresh
docker-compose up -d
```

---

## 📊 7. PRODUCTION CHECKLIST

### Pre-Deployment

- [ ] Change `POSTGRES_PASSWORD` in `.env`
- [ ] Set `DB_SSL=true` if using cloud database
- [ ] Update `VITE_API_URL` to production backend URL
- [ ] Review security settings
- [ ] Backup existing data

### Post-Deployment

- [ ] Verify all containers running: `docker-compose ps`
- [ ] Test API endpoint: `curl https://your-domain.com/api/proposals`
- [ ] Test frontend: `curl https://your-domain.com`
- [ ] Check logs for errors: `docker-compose logs`
- [ ] Verify database connection
- [ ] Test file upload functionality

### Monitoring

- [ ] Set up log monitoring
- [ ] Configure health check alerts
- [ ] Monitor resource usage
- [ ] Regular backups of PostgreSQL data

---

## 🔐 8. SECURITY BEST PRACTICES

### Environment Variables

```env
# NEVER commit .env to git
# Use .env.example as template

# Production password requirements:
# - Minimum 16 characters
# - Mix of uppercase, lowercase, numbers, symbols
# - Not used in any other service
```

### Docker Security

```yaml
# Add to docker-compose.yml
services:
  backend:
    read_only: true
    security_opt:
      - no-new-privileges:true
```

### Network Security

- Use HTTPS in production
- Configure CORS properly
- Implement rate limiting
- Use firewall rules

---

## 📞 9. SUPPORT & RESOURCES

### Documentation

- **GitHub Repository:** https://github.com/kamkikorich/kertas-kerja
- **Express.js Docs:** https://expressjs.com/
- **PostgreSQL Docs:** https://www.postgresql.org/docs/
- **Docker Docs:** https://docs.docker.com/

### Common Commands

```bash
# Start all services
docker-compose up -d

# Stop all services
docker-compose down

# Rebuild containers
docker-compose up -d --build

# View logs
docker-compose logs -f

# Restart service
docker-compose restart <service-name>

# Execute command in container
docker exec -it perkeso-backend sh

# Export images
docker save -o perkeso-images.tar <image-names>

# Import images
docker load -i perkeso-images.tar
```

---

## 📝 10. VERSION HISTORY

| Version | Date | Changes |
|---------|------|---------|
| 1.0.0 | 2026-04-29 | Initial production release |
| | | - Express.js backend |
| | | - React frontend |
| | | - PostgreSQL database |
| | | - Docker containerization |
| | | - Automation scripts |

---

**Last Updated:** 2026-04-29  
**Status:** ✅ Production Ready  
**Verified:** All services tested and operational
