# PERKESO Kertas Kerja - Automation Setup

## ✅ Status Semasa

Semua perkhidmatan berjaya dikonfigurasi dan berjalan:

| Service | Status | Port |
|---------|--------|------|
| **Frontend (React + Vite)** | ✅ Running | 5173 |
| **Backend (Express.js)** | ✅ Running | 5000 |
| **PostgreSQL Database** | ✅ Running | 5432 |

## 🚀 Cara Menjalankan Program

### Kaedah Automatik (Disyorkan)

**Untuk Windows:**

1. **Start semua service:**
   ```
   Double-click start.bat
   ```

2. **Stop semua service:**
   ```
   Double-click stop.bat
   ```

### Kaedah Manual

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

## 📁 Struktur Fail

```
kertas-kerja/
├── app/                    # Frontend React Application
│   ├── src/
│   │   ├── App.jsx        # Main component
│   │   ├── main.jsx       # Entry point
│   │   ├── index.css      # Global styles
│   │   └── App.css        # Component styles
│   ├── package.json
│   └── vite.config.js
│
├── server/                # Backend Express Application
│   ├── index.js          # Main server
│   ├── db.js             # Database connection
│   ├── .env              # Environment variables
│   └── uploads/          # File upload directory
│
├── docker-compose.yml    # Docker configuration
├── start.bat             # Auto-start script
└── stop.bat              # Auto-stop script
```

## 🔧 Environment Variables

### Server (.env)
```
DB_HOST=localhost
DB_PORT=5432
DB_USER=postgres
DB_PASSWORD=<your-password>
DB_NAME=perkeso_db
DB_SSL=false
PORT=5000
```

## 📊 API Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| POST | `/api/proposals` | Create new proposal |
| GET | `/api/proposals` | Get all proposals |

## 🐛 Troubleshooting

### Port sudah digunakan
```bash
# Check port usage
netstat -ano | findstr :5000
netstat -ano | findstr :5173
netstat -ano | findstr :5432

# Kill process by PID
taskkill /F /PID <process-id>
```

### Database connection error
```bash
# Restart Docker container
docker-compose restart

# Check container status
docker ps | findstr perkeso
```

### npm errors
```bash
# Reinstall dependencies
cd app && npm install
cd ../server && npm install
```

## 📝 Notes

- **Dependencies telah diinstall:** ✅
- **Database tables auto-created:** ✅
- **Uploads folder created:** ✅
- **Environment files configured:** ✅

## 🔐 Default Credentials

- **Database User:** postgres
- **Database:** perkeso_db
- **Database Port:** 5432

---
Generated: 2026-04-29
