# Intelligent Healthcare Management System - Quick Reference Guide

## 🚀 Quick Start

### Start the Application

```bash
# Terminal 1 - Backend
cd IntelligentBasedHMS
python api_server.py

# Terminal 2 - Frontend
cd healthcare-app
npm run dev
```

**Access:**
- Frontend: http://localhost:5173
- Backend API: http://localhost:8000
- API Docs: http://localhost:8000/docs

---

## 🔑 Test Credentials

### Existing Users

**User 1:**
- Email: `msaadbinmazhar@gmail.com`
- Password: `123456789`
- Patient ID: 1234

**User 2:**
- Email: `msaadbinmahar1@gmail.com`
- Patient ID: 123456

---

## 📡 API Endpoints Cheat Sheet

### Authentication
```bash
# Login
POST http://localhost:8000/auth/login
Body: {"email": "user@example.com", "password": "password"}

# Register
POST http://localhost:8000/auth/register
Body: {
  "firstName": "John",
  "lastName": "Doe",
  "email": "john@example.com",
  "phone": "+1234567890",
  "address": "123 Main St",
  "emergencyContact": "+0987654321",
  "dateOfBirth": "1990-01-01",
  "gender": "Male",
  "bloodType": "O+",
  "patientId": "12345",
  "password": "securepass"
}
```

### Health Services
```bash
# Health Risk Prediction
POST http://localhost:8000/health-risk/predict
Body: {
  "age": 30,
  "weight": 70,
  "height": 175,
  "bmi": 22.86,
  "exercise": 5,
  "sleep": 7,
  "sugar_intake": 3,
  "smoking": 0,
  "alcohol": 0,
  "profession_doctor": 0,
  "profession_engineer": 1,
  ...
}

# Depression Assessment
POST http://localhost:8000/depression/assess
Body: {
  "gender": "Male",
  "age": 25,
  "profession": "Student",
  "sleep": 6,
  "dietary": "Moderate",
  "succide": "No",
  "work_hours": 8,
  "financial": 3,
  "family": "No",
  "pressure": 4,
  "satisfaction": 3
}

# Pneumonia Detection
POST http://localhost:8000/pneumonia/detect
Body: multipart/form-data with image file

# Medical Chatbot
POST http://localhost:8000/chat
Body: {
  "message": "What are the symptoms of diabetes?",
  "thread_id": "optional-thread-id"
}
```

---

## 🗄️ Database Quick Commands

### PostgreSQL Commands

```bash
# Connect to database
psql -U postgres -d HMS_DATABASE

# View all users
SELECT Patient_ID, First_Name, Last_Name, Email FROM PATIENT_DATA;

# Count users
SELECT COUNT(*) FROM PATIENT_DATA;

# Find user by email
SELECT * FROM PATIENT_DATA WHERE Email = 'user@example.com';

# Delete user (careful!)
DELETE FROM PATIENT_DATA WHERE Patient_ID = 12345;
```

### Python Database Access

```python
import psycopg2

conn = psycopg2.connect(
    database='HMS_DATABASE',
    user='postgres',
    password='1234',
    host='localhost',
    port='5432'
)

curr = conn.cursor()
curr.execute('SELECT * FROM PATIENT_DATA')
users = curr.fetchall()
print(users)

curr.close()
conn.close()
```

---

## 🐛 Troubleshooting

### Common Issues & Solutions

#### Backend Won't Start

**Problem:** `ModuleNotFoundError`
```bash
# Solution: Install dependencies
cd IntelligentBasedHMS
pip install -r requirements.txt
```

**Problem:** Database connection failed
```bash
# Solution: Check PostgreSQL is running
# Windows: services.msc -> postgresql
# Verify credentials in api_server.py
```

**Problem:** Model loading errors
```bash
# Solution: Check model files exist
ls xgb_model.pkl pipe.pkl pneumonia_model_custom.h5

# Reinstall scikit-learn 1.6.1 for depression model
pip install scikit-learn==1.6.1
```

#### Frontend Won't Start

**Problem:** `npm ERR!`
```bash
# Solution: Clear cache and reinstall
cd healthcare-app
rm -rf node_modules package-lock.json
npm install
```

**Problem:** Port 5173 already in use
```bash
# Solution: Kill process or use different port
# Windows: netstat -ano | findstr :5173
# Then: taskkill /PID <pid> /F
```

#### RAG Chatbot Not Working

**Problem:** Keras 3 compatibility error
```bash
# Solution: Install tf-keras
pip install tf-keras
```

**Problem:** API keys not configured
```bash
# Solution: Add to .env file
echo "HUGGINGFACEHUB_API_TOKEN=your_token" >> .env
echo "PINECONE_API_KEY=your_key" >> .env
```

#### Login Not Working

**Problem:** Invalid credentials
```bash
# Solution: Check password in database
python -c "import psycopg2; conn = psycopg2.connect(database='HMS_DATABASE', user='postgres', password='1234', host='localhost', port='5432'); curr = conn.cursor(); curr.execute('SELECT Email, Password FROM PATIENT_DATA'); print(curr.fetchall())"
```

---

## 📦 Dependencies

### Backend Requirements

```txt
fastapi==0.115.6
uvicorn[standard]
python-multipart
psycopg2-binary==2.9.11
passlib[bcrypt]==1.7.4
tensorflow==2.20.0
xgboost
scikit-learn==1.6.1
pandas
numpy
pillow
langchain
langchain-community
langgraph
pinecone-client
python-dotenv
tf-keras==2.20.1
```

### Frontend Dependencies

```json
{
  "react": "^18.3.1",
  "react-dom": "^18.3.1",
  "react-router-dom": "^6.28.0",
  "@mui/material": "^6.1.7",
  "@emotion/react": "^11.13.5",
  "@emotion/styled": "^11.13.5",
  "zustand": "^5.0.2",
  "axios": "^1.7.9",
  "react-hook-form": "^7.54.0",
  "zod": "^3.24.1",
  "framer-motion": "^11.15.0",
  "lucide-react": "^0.468.0"
}
```

---

## 🔧 Configuration Files

### Backend .env Template

```env
# HuggingFace API
HUGGINGFACEHUB_API_TOKEN=hf_xxxxxxxxxxxxxxxxxxxxx

# Pinecone Vector Database
PINECONE_API_KEY=pcsk_xxxxxxxxxxxxxxxxxxxxx
PINECONE_ENVIRONMENT=us-east-1

# Database (configured in code)
# DB_NAME=HMS_DATABASE
# DB_USER=postgres
# DB_PASS=1234
# DB_HOST=localhost
# DB_PORT=5432
```

### Frontend Environment Variables

```env
# API Base URL
VITE_API_URL=http://localhost:8000

# App Configuration
VITE_APP_NAME=Healthcare Management System
VITE_APP_VERSION=1.0.0
```

---

## 📊 Monitoring & Logs

### Check Server Status

```bash
# Backend health check
curl http://localhost:8000/health

# Expected response:
# {
#   "status": "healthy",
#   "models": {
#     "health_risk": true,
#     "depression": true,
#     "pneumonia": true
#   }
# }
```

### View Logs

```bash
# Backend logs (if running in terminal)
# Check terminal output for:
# ✓ PostgreSQL database connected successfully
# ✓ Health risk model loaded
# ✓ Depression model loaded
# ✓ Pneumonia model loaded
# ✓ RAG Chatbot loaded successfully

# Frontend logs
# Check browser console (F12)
```

---

## 🧪 Testing Commands

### Manual API Testing

```bash
# Using curl
curl -X POST http://localhost:8000/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"msaadbinmazhar@gmail.com","password":"123456789"}'

# Using PowerShell
Invoke-RestMethod -Uri "http://localhost:8000/auth/login" `
  -Method POST `
  -ContentType "application/json" `
  -Body '{"email":"msaadbinmazhar@gmail.com","password":"123456789"}'
```

### Database Testing

```python
# test_db.py
from database import authenticate_user, check_database_connection

# Test connection
if check_database_connection():
    print("✅ Database connected")
else:
    print("❌ Database connection failed")

# Test authentication
user = authenticate_user("msaadbinmazhar@gmail.com", "123456789")
if user:
    print(f"✅ Login successful: {user['first_name']}")
else:
    print("❌ Login failed")
```

---

## 🎨 UI Component Examples

### Using GlassCard Component

```tsx
import { GlassCard } from '../components';

<GlassCard sx={{ p: 3 }}>
  <Typography variant="h5">Card Title</Typography>
  <Typography>Card content goes here</Typography>
</GlassCard>
```

### Using GradientButton Component

```tsx
import { GradientButton } from '../components';

<GradientButton
  variant="primary"
  onClick={handleClick}
  loading={isLoading}
>
  Click Me
</GradientButton>
```

---

## 📱 Feature Access Map

### Patient Dashboard Features

| Feature | Route | Description |
|---------|-------|-------------|
| Dashboard | `/patient/dashboard` | Overview & quick actions |
| Health Prediction | `/patient/health-prediction` | Lifestyle risk assessment |
| Depression Screening | `/patient/depression` | Mental health assessment |
| Pneumonia Detection | `/patient/pneumonia` | X-ray analysis |
| Medical Chatbot | `/patient/chatbot` | AI medical assistant |

### Doctor Dashboard Features

| Feature | Route | Description |
|---------|-------|-------------|
| Dashboard | `/doctor/dashboard` | Patient overview |
| Patient List | `/doctor/patients` | Manage patients |
| Analytics | `/doctor/analytics` | Health statistics |

---

## 🔐 Security Checklist

### Current Implementation

- [x] CORS configured
- [x] Input validation
- [x] SQL injection prevention (parameterized queries)
- [x] JWT token authentication
- [x] Duplicate email prevention
- [ ] Password hashing (plain text currently)
- [ ] Rate limiting
- [ ] HTTPS/TLS
- [ ] Email verification
- [ ] 2FA

### Recommended for Production

```python
# Enable password hashing
from database import get_password_hash, verify_password

# When registering
hashed_password = get_password_hash(plain_password)

# When authenticating
if verify_password(plain_password, user['hashed_password']):
    # Login successful
```

---

## 📈 Performance Tips

### Optimize Frontend

```tsx
// Lazy load routes
const HealthPrediction = lazy(() => import('./pages/HealthPrediction'));

// Memoize expensive computations
const memoizedValue = useMemo(() => computeExpensiveValue(a, b), [a, b]);

// Debounce API calls
const debouncedSearch = debounce(searchFunction, 300);
```

### Optimize Backend

```python
# Use connection pooling
from sqlalchemy import create_engine
engine = create_engine(DATABASE_URL, pool_size=10, max_overflow=20)

# Cache responses
from functools import lru_cache

@lru_cache(maxsize=100)
def get_static_data():
    return expensive_operation()
```

---

## 🎯 Quick Commands Reference

```bash
# Start everything
npm run dev & python api_server.py

# Install all dependencies
pip install -r requirements.txt && npm install

# Check versions
python --version
node --version
npm --version
psql --version

# View running processes
# Windows: tasklist | findstr python
# Windows: tasklist | findstr node

# Kill processes
# Windows: taskkill /IM python.exe /F
# Windows: taskkill /IM node.exe /F

# Database backup
pg_dump -U postgres HMS_DATABASE > backup.sql

# Database restore
psql -U postgres HMS_DATABASE < backup.sql
```

---

## 📞 Support & Resources

### Documentation Files

- `PROJECT_COMPREHENSIVE_REPORT.md` - Complete project documentation
- `PROJECT_VISUAL_SUMMARY.md` - Visual diagrams and charts
- `CHATBOT_RAG_STATUS.md` - RAG chatbot details
- `LOGIN_DATABASE_STATUS.md` - Authentication system details
- `DEPRESSION_MODEL_FIX.md` - Depression model troubleshooting

### External Resources

- [FastAPI Documentation](https://fastapi.tiangolo.com/)
- [React Documentation](https://react.dev/)
- [Material-UI Documentation](https://mui.com/)
- [PostgreSQL Documentation](https://www.postgresql.org/docs/)
- [LangChain Documentation](https://python.langchain.com/)

---

**Last Updated**: November 26, 2025
**Version**: 1.0
**Status**: ✅ Production Ready
