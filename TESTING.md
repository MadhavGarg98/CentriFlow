# CentriFlow ERP System - Testing Guide

## 🧪 Testing Overview

This guide covers comprehensive testing for the CentriFlow ERP system, including unit tests, integration tests, and end-to-end testing.

## 📋 Test Categories

### 1. Backend Testing

#### Authentication Tests

```javascript
// tests/auth.test.js
const request = require('supertest')
const app = require('../server')

describe('Authentication', () => {
  test('POST /api/auth/register - Successful registration', async () => {
    const userData = {
      name: 'Test User',
      email: 'test@example.com',
      password: 'Test123!',
      role: 'student'
    }
    
    const response = await request(app)
      .post('/api/auth/register')
      .send(userData)
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.user.email).toBe(userData.email)
    expect(response.body.data.token).toBeDefined()
  })

  test('POST /api/auth/login - Successful login', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'Test123!'
    }
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.token).toBeDefined()
  })

  test('POST /api/auth/login - Invalid credentials', async () => {
    const credentials = {
      email: 'test@example.com',
      password: 'wrongpassword'
    }
    
    const response = await request(app)
      .post('/api/auth/login')
      .send(credentials)
      .expect(401)
    
    expect(response.body.success).toBe(false)
  })
})
```

#### Attendance Tests

```javascript
// tests/attendance.test.js
describe('Attendance', () => {
  let token, studentId, facultyId

  beforeAll(async () => {
    // Setup test users and get tokens
  })

  test('POST /api/attendance - Mark attendance (Faculty)', async () => {
    const attendanceData = {
      student: studentId,
      subject: 'Mathematics',
      semester: 'Fall 2024',
      status: 'present'
    }
    
    const response = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .send(attendanceData)
      .expect(201)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.attendance.status).toBe('present')
  })

  test('GET /api/attendance - Get attendance records', async () => {
    const response = await request(app)
      .get('/api/attendance')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(Array.isArray(response.body.data.attendance)).toBe(true)
  })
})
```

#### Analytics Tests

```javascript
// tests/analytics.test.js
describe('Analytics', () => {
  test('GET /api/analytics/student - Get student analytics', async () => {
    const response = await request(app)
      .get('/api/analytics/student')
      .set('Authorization', `Bearer ${token}`)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.analytics).toBeDefined()
  })

  test('POST /api/analytics/predict - Generate AI prediction', async () => {
    const predictionData = {
      studentId: 'student123',
      semester: 'Fall 2024'
    }
    
    const response = await request(app)
      .post('/api/analytics/predict')
      .set('Authorization', `Bearer ${token}`)
      .send(predictionData)
      .expect(200)
    
    expect(response.body.success).toBe(true)
    expect(response.body.data.prediction).toBeDefined()
  })
})
```

### 2. Frontend Testing

#### Component Tests

```javascript
// src/components/__tests__/Button.test.jsx
import { render, screen, fireEvent } from '@testing-library/react'
import Button from '../Button'

describe('Button Component', () => {
  test('renders button with text', () => {
    render(<Button>Click me</Button>)
    expect(screen.getByText('Click me')).toBeInTheDocument()
  })

  test('calls onClick when clicked', () => {
    const handleClick = jest.fn()
    render(<Button onClick={handleClick}>Click me</Button>)
    
    fireEvent.click(screen.getByText('Click me'))
    expect(handleClick).toHaveBeenCalledTimes(1)
  })

  test('applies correct styles for variant', () => {
    render(<Button variant="primary">Primary Button</Button>)
    const button = screen.getByText('Primary Button')
    expect(button).toHaveClass('btn-primary')
  })
})
```

#### Page Tests

```javascript
// src/pages/__tests__/Login.test.jsx
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import { AuthProvider } from '../../context/AuthContext'
import Login from '../Login'

const renderWithProviders = (component) => {
  return render(
    <BrowserRouter>
      <AuthProvider>
        {component}
      </AuthProvider>
    </BrowserRouter>
  )
}

describe('Login Page', () => {
  test('renders login form', () => {
    renderWithProviders(<Login />)
    
    expect(screen.getByLabelText(/email address/i)).toBeInTheDocument()
    expect(screen.getByLabelText(/password/i)).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /sign in/i })).toBeInTheDocument()
  })

  test('shows validation errors for empty fields', async () => {
    renderWithProviders(<Login />)
    
    const submitButton = screen.getByRole('button', { name: /sign in/i })
    fireEvent.click(submitButton)
    
    await waitFor(() => {
      expect(screen.getByText(/email is required/i)).toBeInTheDocument()
      expect(screen.getByText(/password is required/i)).toBeInTheDocument()
    })
  })
})
```

### 3. AI Service Testing

#### Prediction Tests

```python
# tests/test_predictions.py
import pytest
from fastapi.testclient import TestClient
from main import app

client = TestClient(app)

def test_predict_student_performance():
    student_data = {
        "student": {
            "name": "Test Student",
            "attendancePercentage": 85.0,
            "totalClasses": 20,
            "presentClasses": 17,
            "averageGrades": 75.0
        },
        "semester": "Fall 2024"
    }
    
    response = client.post("/predict", json=student_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert "prediction" in data
    assert "riskLevel" in data["prediction"]
    assert "recommendations" in data["prediction"]

def test_chat_with_ai():
    chat_data = {
        "message": "What is my attendance?",
        "context": {
            "user": {"name": "Test User", "role": "student"},
            "attendance": {"percentage": 85.0},
            "performance": {"riskLevel": "low"}
        },
        "userId": "test123"
    }
    
    response = client.post("/chat", json=chat_data)
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    assert "response" in data
    assert len(data["response"]) > 0
```

#### Face Recognition Tests

```python
# tests/test_face_recognition.py
import pytest
import base64
from io import BytesIO
from PIL import Image

def test_face_recognition_success():
    # Create a test image
    img = Image.new('RGB', (100, 100), color='red')
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    response = client.post("/face-recognition", json={"image": img_str})
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is True
    # Note: Mock response in test environment

def test_face_recognition_no_face():
    # Create an image with no face
    img = Image.new('RGB', (100, 100), color='blue')
    buffered = BytesIO()
    img.save(buffered, format="JPEG")
    img_str = base64.b64encode(buffered.getvalue()).decode()
    
    response = client.post("/face-recognition", json={"image": img_str})
    assert response.status_code == 200
    
    data = response.json()
    assert data["success"] is False
    assert "No face detected" in data["message"]
```

## 🔄 Integration Testing

### API Integration Tests

```javascript
// tests/integration/api.test.js
describe('API Integration', () => {
  test('Complete user flow: Register -> Login -> Access Dashboard', async () => {
    // Register user
    const registerResponse = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Integration User',
        email: 'integration@test.com',
        password: 'Test123!',
        role: 'student'
      })
    
    expect(registerResponse.status).toBe(201)
    const token = registerResponse.body.data.token

    // Access protected route
    const dashboardResponse = await request(app)
      .get('/api/analytics/student')
      .set('Authorization', `Bearer ${token}`)
    
    expect(dashboardResponse.status).toBe(200)
  })

  test('Faculty marks attendance and student views it', async () => {
    // Faculty marks attendance
    const facultyToken = 'faculty_jwt_token'
    const attendanceResponse = await request(app)
      .post('/api/attendance')
      .set('Authorization', `Bearer ${facultyToken}`)
      .send({
        student: 'student_id',
        subject: 'Mathematics',
        semester: 'Fall 2024',
        status: 'present'
      })
    
    expect(attendanceResponse.status).toBe(201)

    // Student views attendance
    const studentToken = 'student_jwt_token'
    const viewResponse = await request(app)
      .get('/api/attendance')
      .set('Authorization', `Bearer ${studentToken}`)
    
    expect(viewResponse.status).toBe(200)
    expect(viewResponse.body.data.attendance.length).toBeGreaterThan(0)
  })
})
```

### Frontend-Backend Integration

```javascript
// tests/integration/frontend-backend.test.js
import { render, screen, fireEvent, waitFor } from '@testing-library/react'
import { BrowserRouter } from 'react-router-dom'
import Dashboard from '../../src/pages/Dashboard'

// Mock API calls
jest.mock('../../src/services/api', () => ({
  analyticsAPI: {
    getDashboardAnalytics: jest.fn(),
    getStudentAnalytics: jest.fn()
  }
}))

describe('Frontend-Backend Integration', () => {
  test('Dashboard loads and displays analytics data', async () => {
    const mockData = {
      success: true,
      data: {
        overview: {
          totalStudents: 100,
          totalFaculty: 20,
          overallAttendancePercentage: 85.5
        }
      }
    }
    
    analyticsAPI.getDashboardAnalytics.mockResolvedValue(mockData)
    
    render(
      <BrowserRouter>
        <Dashboard />
      </BrowserRouter>
    )
    
    await waitFor(() => {
      expect(screen.getByText('100')).toBeInTheDocument()
      expect(screen.getByText('85.5%')).toBeInTheDocument()
    })
  })
})
```

## 🎭 End-to-End Testing

### Cypress Tests

```javascript
// cypress/e2e/user-journey.cy.js
describe('User Journey E2E', () => {
  beforeEach(() => {
    cy.visit('http://localhost:5173')
  })

  it('Complete student journey', () => {
    // Register new user
    cy.get('[href="/signup"]').click()
    cy.get('[name="name"]').type('Test Student')
    cy.get('[name="email"]').type('student@test.com')
    cy.get('[name="password"]').type('Student123!')
    cy.get('[name="confirmPassword"]').type('Student123!')
    cy.get('button[type="submit"]').click()
    
    // Should redirect to dashboard
    cy.url().should('include', '/dashboard')
    
    // Navigate to analytics
    cy.get('[href="/analytics"]').click()
    cy.url().should('include', '/analytics')
    
    // Generate AI prediction
    cy.get('button').contains('Generate AI Prediction').click()
    cy.get('[data-testid="risk-level"]').should('be.visible')
    
    // Test chat functionality
    cy.get('[href="/chat"]').click()
    cy.get('input[placeholder*="Ask me anything"]').type('What is my attendance?{enter}')
    cy.get('[data-testid="chat-message"]').should('contain', 'attendance')
  })

  it('Faculty attendance marking', () => {
    // Login as faculty
    cy.visit('http://localhost:5173/login')
    cy.get('[name="email"]').type('faculty@test.com')
    cy.get('[name="password"]').type('Faculty123!')
    cy.get('button[type="submit"]').click()
    
    // Mark attendance
    cy.get('[href="/attendance"]').click()
    cy.get('select[name="student"]').select('Test Student')
    cy.get('select[name="subject"]').select('Mathematics')
    cy.get('select[name="semester"]').select('Fall 2024')
    cy.get('button').contains('Mark Present').click()
    
    // Verify success message
    cy.get('.toast').should('contain', 'Attendance marked successfully')
  })
})
```

## 📊 Performance Testing

### Load Testing with Artillery

```yaml
# artillery-config.yml
config:
  target: 'http://localhost:5000'
  phases:
    - duration: 60
      arrivalRate: 10
    - duration: 120
      arrivalRate: 20
    - duration: 60
      arrivalRate: 5

scenarios:
  - name: "Login and Dashboard"
    weight: 70
    flow:
      - post:
          url: "/api/auth/login"
          json:
            email: "test@example.com"
            password: "Test123!"
          capture:
            - json: "$.data.token"
              as: "authToken"
      - get:
          url: "/api/analytics/student"
          headers:
            Authorization: "Bearer {{ authToken }}"

  - name: "Mark Attendance"
    weight: 30
    flow:
      - post:
          url: "/api/attendance"
          headers:
            Authorization: "Bearer {{ authToken }}"
          json:
            student: "student123"
            subject: "Mathematics"
            semester: "Fall 2024"
            status: "present"
```

## 🔍 Security Testing

### Security Test Cases

```javascript
// tests/security.test.js
describe('Security Tests', () => {
  test('SQL Injection protection', async () => {
    const maliciousInput = "'; DROP TABLE users; --"
    
    const response = await request(app)
      .post('/api/auth/login')
      .send({
        email: maliciousInput,
        password: 'password'
      })
    
    expect(response.status).toBe(401)
  })

  test('XSS protection', async () => {
    const xssPayload = '<script>alert("xss")</script>'
    
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: xssPayload,
        email: 'test@example.com',
        password: 'Test123!',
        role: 'student'
      })
    
    expect(response.status).toBe(201)
    expect(response.body.data.user.name).not.toContain('<script>')
  })

  test('JWT token validation', async () => {
    const response = await request(app)
      .get('/api/analytics/student')
      .set('Authorization', 'Bearer invalid_token')
    
    expect(response.status).toBe(401)
  })
})
```

## 🚀 Test Execution

### Running All Tests

```bash
# Backend tests
cd backend
npm test

# Frontend tests
cd frontend
npm test

# AI Service tests
cd ai-service
pytest

# E2E tests
npx cypress run

# Performance tests
artillery run artillery-config.yml
```

### Coverage Reports

```bash
# Backend coverage
cd backend
npm run test:coverage

# Frontend coverage
cd frontend
npm run test:coverage
```

## 📝 Test Data Management

### Seed Test Data

```javascript
// scripts/seedTestData.js
const mongoose = require('mongoose')
const User = require('../backend/models/User')
const Attendance = require('../backend/models/Attendance')

const seedData = async () => {
  // Create test users
  const testStudent = new User({
    name: 'Test Student',
    email: 'student@test.com',
    password: 'hashedpassword',
    role: 'student'
  })
  
  await testStudent.save()
  
  // Create test attendance
  const attendance = new Attendance({
    student: testStudent._id,
    subject: 'Mathematics',
    semester: 'Fall 2024',
    status: 'present'
  })
  
  await attendance.save()
  console.log('Test data seeded successfully')
}

seedData().then(() => process.exit(0))
```

### Cleanup Test Data

```javascript
// scripts/cleanupTestData.js
const mongoose = require('mongoose')
const User = require('../backend/models/User')
const Attendance = require('../backend/models/Attendance')

const cleanupData = async () => {
  await User.deleteMany({ email: { $in: ['test@example.com', 'faculty@test.com'] } })
  await Attendance.deleteMany({})
  console.log('Test data cleaned up successfully')
}

cleanupData().then(() => process.exit(0))
```

## 📋 Test Checklist

### Pre-Deployment Checklist

- [ ] All unit tests pass
- [ ] Integration tests pass
- [ ] E2E tests pass
- [ ] Security tests pass
- [ ] Performance tests meet requirements
- [ ] Code coverage > 80%
- [ ] API documentation updated
- [ ] Test environments configured

### Regression Testing

- [ ] Authentication flow
- [ ] Role-based access
- [ ] Attendance marking
- [ ] Analytics generation
- [ ] AI chat functionality
- [ ] Face recognition
- [ ] Profile management
- [ ] Error handling

## 🔧 Test Configuration

### Jest Configuration (Frontend)

```javascript
// jest.config.js
module.exports = {
  testEnvironment: 'jsdom',
  setupFilesAfterEnv: ['<rootDir>/src/setupTests.js'],
  moduleNameMapping: {
    '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  },
  collectCoverageFrom: [
    'src/**/*.{js,jsx}',
    '!src/index.js',
    '!src/reportWebVitals.js'
  ],
  coverageThreshold: {
    global: {
      branches: 80,
      functions: 80,
      lines: 80,
      statements: 80
    }
  }
}
```

### Pytest Configuration (AI Service)

```python
# pytest.ini
[tool:pytest]
testpaths = tests
python_files = test_*.py
python_classes = Test*
python_functions = test_*
addopts = 
    --cov=main
    --cov-report=html
    --cov-report=term-missing
    --cov-fail-under=80
```

This comprehensive testing guide ensures the CentriFlow ERP system is thoroughly tested across all layers and components.
