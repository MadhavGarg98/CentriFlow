# CentriFlow ERP System - Setup Guide

## 🚀 Quick Start

### Prerequisites

Before you begin, ensure you have following installed:

- **Node.js** (v18 or higher)
- **Python** (v3.9 or higher)
- **MongoDB** (running locally or connection string)
- **Git**
- **Groq API Key** (for AI features)

### Installation Steps

#### 1. Clone and Install Dependencies

```bash
# Navigate to project directory
cd CentriFlow

# Install all dependencies for all services
npm run install:all
```

#### 2. Environment Configuration

Create `.env` files in each service directory:

**Backend (.env)**:
```env
MONGODB_URI=mongodb://localhost:27017/centriflow
JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
OPENAI_API_KEY=your-openai-key
AI_SERVICE_URL=http://localhost:8000
PORT=5000
NODE_ENV=development
```

**Frontend (.env)**:
```env
VITE_API_URL=http://localhost:5000
```

**AI Service (.env)**:
```env
OPENAI_API_KEY=your-openai-api-key-here
HOST=0.0.0.0
PORT=8000
DEBUG=true
```

#### 3. Start All Services

```bash
# Start all services simultaneously
npm run dev
```

This will start:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- AI Service: http://localhost:8000

## 📁 Project Structure

```
CentriFlow/
├── frontend/                 # React Vite application
│   ├── src/
│   │   ├── components/      # Reusable UI components
│   │   ├── pages/          # Page components
│   │   ├── layouts/        # Layout components
│   │   ├── context/        # React context
│   │   ├── services/       # API services
│   │   ├── styles/         # Global styles
│   │   └── utils/         # Utility functions
│   ├── package.json
│   └── vite.config.js
├── backend/                 # Node.js Express API
│   ├── controllers/         # Route controllers
│   ├── models/            # MongoDB models
│   ├── routes/            # API routes
│   ├── middleware/        # Express middleware
│   ├── config/           # Configuration files
│   ├── utils/            # Utility functions
│   └── server.js         # Server entry point
├── ai-service/            # Python FastAPI service
│   ├── main.py           # FastAPI application
│   └── requirements.txt  # Python dependencies
├── package.json           # Root package.json
└── README.md            # Project documentation
```

## 🔧 Individual Service Setup

### Backend Setup

```bash
cd backend
npm install
npm run dev
```

**Available Scripts:**
- `npm run dev` - Start with nodemon
- `npm start` - Start production server
- `npm test` - Run tests

### Frontend Setup

```bash
cd frontend
npm install
npm run dev
```

**Available Scripts:**
- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build

### AI Service Setup

```bash
cd ai-service
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

## 🔐 Authentication System

### JWT Token Management

The system uses JWT tokens for authentication:

1. **Login/Signup**: Token generated and stored in localStorage
2. **API Calls**: Token sent in Authorization header
3. **Auto-logout**: Token expiration handled automatically

### Role-Based Access Control

Three user roles with different permissions:

- **Admin**: Full system access, user management
- **Faculty**: Mark attendance, view student data
- **Student**: View own data, chat with AI

## 📸 Face Recognition Setup

### Prerequisites

The face recognition system requires:

```bash
# Install system dependencies (Ubuntu/Debian)
sudo apt-get update
sudo apt-get install cmake
sudo apt-get install libopenblas-dev
sudo apt-get install liblapack-dev
sudo apt-get install libx11-dev
sudo apt-get install libgtk-3-dev

# Install Python packages
pip install dlib
pip install face-recognition
```

### Face Registration

1. Students upload profile images
2. Face encodings extracted and stored
3. Used for attendance verification

## 🤖 AI Service Integration

### AI Service Configuration

Use Groq LLM API:

* Base URL: https://api.groq.com/openai/v1
* Use OpenAI-compatible format (same request structure)

Model:

* "llama3-70b-8192" (preferred)
* fallback: "mixtral-8x7b-32768"

### Fallback Mode

If Groq API is unavailable, system uses:
- Rule-based responses
- Heuristic predictions
- Basic analytics

## 📊 Database Setup

### MongoDB Collections

- **users**: User accounts and profiles
- **attendance**: Attendance records
- **analytics**: Student analytics and predictions

### Sample Data

Create sample users:

```javascript
// Admin user
{
  "name": "Admin User",
  "email": "admin@centriflow.com",
  "password": "Admin123!",
  "role": "admin"
}

// Faculty user
{
  "name": "Faculty User",
  "email": "faculty@centriflow.com",
  "password": "Faculty123!",
  "role": "faculty"
}

// Student user
{
  "name": "Student User",
  "email": "student@centriflow.com",
  "password": "Student123!",
  "role": "student"
}
```

## 🚨 Troubleshooting

### Common Issues

1. **Port Conflicts**:
   - Change ports in environment variables
   - Kill existing processes: `lsof -ti:5000 | xargs kill`

2. **MongoDB Connection**:
   - Ensure MongoDB is running
   - Check connection string in .env

3. **CORS Issues**:
   - Verify frontend URL in backend CORS config
   - Check API_URL in frontend .env

4. **Face Recognition Errors**:
   - Install system dependencies
   - Check Python package versions

5. **OpenAI API Errors**:
   - Verify API key is valid
   - Check API quota and billing

### Debug Mode

Enable debug logging:

```bash
# Backend
DEBUG=app:* npm run dev

# AI Service
DEBUG=true uvicorn main:app --reload
```

## 🧪 Testing

### Backend Tests

```bash
cd backend
npm test
```

### Frontend Tests

```bash
cd frontend
npm test
```

### API Testing

Use Postman or curl:

```bash
# Health check
curl http://localhost:5000/health

# Register user
curl -X POST http://localhost:5000/api/auth/register \
  -H "Content-Type: application/json" \
  -d '{"name":"Test User","email":"test@example.com","password":"Test123!","role":"student"}'

# Login
curl -X POST http://localhost:5000/api/auth/login \
  -H "Content-Type: application/json" \
  -d '{"email":"test@example.com","password":"Test123!"}'
```

## 🚀 Production Deployment

### Environment Variables

Set production-specific variables:

```env
NODE_ENV=production
JWT_SECRET=your-production-secret
MONGODB_URI=mongodb+srv://user:pass@cluster.mongodb.net/centriflow
```

### Build and Deploy

```bash
# Build frontend
cd frontend
npm run build

# Start backend in production
cd ../backend
npm start

# Start AI service
cd ../ai-service
uvicorn main:app --host 0.0.0.0 --port 8000
```

### Docker Deployment

```dockerfile
# Dockerfile for backend
FROM node:18-alpine
WORKDIR /app
COPY package*.json ./
RUN npm ci --only=production
COPY . .
EXPOSE 5000
CMD ["npm", "start"]
```

## 📞 Support

For issues and support:

1. Check this documentation
2. Review error logs
3. Check GitHub issues
4. Contact development team

## 🔄 Updates

To update the system:

```bash
# Pull latest changes
git pull origin main

# Update dependencies
npm run install:all

# Restart services
npm run dev
```
