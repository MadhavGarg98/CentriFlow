# CentriFlow ERP System

A comprehensive AI-powered ERP system for education management with role-based access control, attendance tracking, student analytics, and intelligent chatbot assistance.

## 🔧 TECHNOLOGY STACK

**Frontend:**
* React (Vite)
* JavaScript (JSX)
* CSS Modules
* Framer Motion (animations)
* Axios
* React Router DOM

**Backend:**
* Node.js
* Express.js
* MongoDB (Mongoose)
* JWT Authentication

**AI Service:**
* Python (FastAPI)
* Groq API (LLaMA3-70B-8192)
* scikit-learn (basic prediction model)
* OpenCV (face recognition)

## 🚀 Quick Start

### Prerequisites
- Node.js 18+
- Python 3.9+
- MongoDB
- Groq API key

### Installation

1. Clone and install all dependencies:
```bash
npm run install:all
```

2. Set up environment variables (see Environment Setup section)

3. Start all services:
```bash
npm run dev
```

Services will run on:
- Frontend: http://localhost:5173
- Backend: http://localhost:5000
- AI Service: http://localhost:8000

## 📁 Project Structure

```
CentriFlow/
├── frontend/          # React application
├── backend/           # Node.js API server
├── ai-service/        # Python FastAPI service
└── package.json    ## 🤖 AI INTEGRATION

### Chatbot

The AI chatbot is integrated into the student dashboard and provides:

* **Personalized Responses**: Uses student data (attendance, performance, risk level)
* **Context-Aware**: Understands current academic situation
* **24/7 Availability**: Always available to help students
* **Multi-Topic Support**: Attendance, performance, recommendations, scheduling

### Predictions

The AI service provides intelligent predictions:

* **Risk Assessment**: Analyzes attendance patterns to identify at-risk students
* **Performance Forecasting**: Predicts future academic performance
* **Dropout Risk**: Calculates probability of student dropout
* **Recommendations**: Provides actionable improvement suggestions

### Technical Details

* **Groq LLaMA3-70B-8192**: Primary model for responses
* **Fallback Model**: Mixtral-8x7b-32768 for backup
* **Context Integration**: Real-time student data integration
* **Error Handling**: Graceful degradation when AI service fails

## 🔐 Features

- **Authentication**: Secure JWT-based login/signup with role management
- **Role-based Dashboards**: Admin, Faculty, and Student interfaces
- **Attendance System**: AI-powered face recognition for automated attendance
- **Student Analytics**: Predictive analytics with risk assessment
- **AI Chatbot**: Intelligent assistant for queries and support
- **Premium UI**: Modern, responsive design with smooth animations

## 🎯 User Roles

### Admin
- User management
- System analytics
- Configuration settings

### Faculty
- Mark attendance
- View student performance
- Manage classes

### Student
- View attendance records
- Track performance metrics
- Chat with AI assistant

## 🔧 Environment Setup

Create `.env` files in each service directory:

### Backend (.env)
```
MONGODB_URI=mongodb://localhost:27017/centriflow
JWT_SECRET=your-super-secret-jwt-key
CLOUDINARY_CLOUD_NAME=your-cloudinary-name
CLOUDINARY_API_KEY=your-cloudinary-key
CLOUDINARY_API_SECRET=your-cloudinary-secret
GROQ_API_KEY=your-groq-api-key-here
AI_SERVICE_URL=http://localhost:8000
```

### Frontend (.env)
```
VITE_API_URL=http://localhost:5000
```

### AI Service (.env)
```
GROQ_API_KEY=your-groq-api-key-here
```

## 📊 API Endpoints

### Backend
- `POST /api/auth/register` - User registration
- `POST /api/auth/login` - User authentication
- `GET /api/users` - User management
- `POST /api/attendance` - Mark attendance
- `GET /api/analytics/:studentId` - Student analytics

### AI Service
- `POST /predict` - Student performance prediction
- `POST /chat` - AI chatbot interaction
- `POST /face-recognition` - Face recognition for attendance

## 🎨 UI/UX Design

- Modern glassmorphism design
- Smooth animations with Framer Motion
- Responsive layout for all devices
- Premium color scheme and typography
- Micro-interactions and hover effects

## 🚀 Deployment

### Frontend
```bash
cd frontend
npm run build
```

### Backend
```bash
cd backend
npm start
```

### AI Service
```bash
cd ai-service
uvicorn main:app --host 0.0.0.0 --port 8000
```

## 📝 License

MIT License - see LICENSE file for details
