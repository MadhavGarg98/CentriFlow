from fastapi import FastAPI, HTTPException, File, UploadFile, BackgroundTasks
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional, Dict, Any
import os
import json
import base64
import numpy as np
from io import BytesIO
from PIL import Image
import cv2
# import face_recognition  # Temporarily commented out
from sklearn.ensemble import RandomForestClassifier
from sklearn.preprocessing import StandardScaler
import requests
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# Initialize FastAPI app
app = FastAPI(
    title="CentriFlow AI Service",
    description="AI-powered analytics and face recognition for CentriFlow ERP",
    version="1.0.0"
)

# Configure CORS
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5000", "http://localhost:5173"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize Groq API
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
GROQ_BASE_URL = "https://api.groq.com/openai/v1"
GROQ_MODEL = "llama3-70b-8192"
GROQ_FALLBACK_MODEL = "mixtral-8x7b-32768"

# In-memory storage for face encodings (in production, use a database)
known_faces = {}

# Pydantic models
class StudentData(BaseModel):
    name: str
    enrollmentDate: str
    attendancePercentage: float
    totalClasses: int
    presentClasses: int
    averageGrades: float = 0.0
    recentAttendance: List[Dict[str, Any]] = []

class PredictionRequest(BaseModel):
    student: StudentData
    semester: str

class PredictionResponse(BaseModel):
    success: bool
    prediction: Dict[str, Any]

class ChatRequest(BaseModel):
    message: str
    context: Dict[str, Any]
    userId: str

class ChatResponse(BaseModel):
    success: bool
    response: str

class FaceRecognitionRequest(BaseModel):
    image: str  # Base64 encoded image

class FaceRecognitionResponse(BaseModel):
    success: bool
    student: Optional[Dict[str, Any]] = None
    confidence: Optional[float] = None
    message: str

# Helper functions
def call_groq_api(messages: List[Dict], model: str = None) -> Dict:
    """Call Groq API with given messages"""
    try:
        headers = {
            "Authorization": f"Bearer {GROQ_API_KEY}",
            "Content-Type": "application/json"
        }
        
        data = {
            "model": model or GROQ_MODEL,
            "messages": messages,
            "max_tokens": 1000,
            "temperature": 0.7
        }
        
        response = requests.post(
            f"{GROQ_BASE_URL}/chat/completions",
            headers=headers,
            json=data,
            timeout=30
        )
        
        if response.status_code == 200:
            return {
                "success": True,
                "content": response.json()["choices"][0]["message"]["content"]
            }
        else:
            # Try fallback model
            if model != GROQ_FALLBACK_MODEL:
                return call_groq_api(messages, GROQ_FALLBACK_MODEL)
            return {"success": False, "error": "API call failed"}
            
    except Exception as e:
        print(f"Groq API error: {str(e)}")
        return {"success": False, "error": str(e)}

def get_fallback_prediction(student):
    """Generate fallback prediction using heuristics"""
    attendance_percentage = student.attendancePercentage
    
    # Calculate risk based on attendance
    if attendance_percentage >= 75:
        risk_level = "low"
        risk_score = max(0, 100 - attendance_percentage)
        dropout_risk = max(0, (100 - attendance_percentage) * 0.3)
    elif attendance_percentage >= 50:
        risk_level = "medium"
        risk_score = max(40, 100 - attendance_percentage)
        dropout_risk = max(30, (100 - attendance_percentage) * 0.5)
    else:
        risk_level = "high"
        risk_score = max(70, 100 - attendance_percentage)
        dropout_risk = max(60, (100 - attendance_percentage) * 0.7)
    
    performance_prediction = min(100, attendance_percentage + 10)
    
    # Determine trend based on recent attendance
    if len(student.recentAttendance) >= 5:
        recent_present = sum(1 for a in student.recentAttendance[-5:] if a['status'] == 'present')
        recent_rate = recent_present / 5
        
        if recent_rate > 0.8:
            performance_trend = "improving"
        elif recent_rate < 0.6:
            performance_trend = "declining"
        else:
            performance_trend = "stable"
    else:
        performance_trend = "stable"
    
    recommendations = []
    if attendance_percentage < 60:
        recommendations.append("Critical: Attendance is below minimum requirements")
    if attendance_percentage < 75:
        recommendations.append("Focus on improving attendance to enhance academic performance")
        recommendations.append("Consider joining study groups for better engagement")
    if attendance_percentage >= 75:
        recommendations.append("Maintain current excellent attendance level")
        recommendations.append("Consider helping peers who may be struggling")
    
    prediction = {
        "riskLevel": risk_level,
        "riskScore": round(risk_score, 2),
        "dropoutRisk": round(dropout_risk, 2),
        "performancePrediction": round(performance_prediction, 2),
        "performanceTrend": performance_trend,
        "recommendations": recommendations,
        "confidence": round(85 + (student.totalClasses / 10), 1)
    }
    
    return PredictionResponse(success=True, prediction=prediction)

def generate_fallback_response(message: str, context: Dict) -> str:
    """Generate fallback responses when Groq is unavailable"""
    message_lower = message.lower()
    
    if "attendance" in message_lower:
        return f"Your current attendance is {context['attendance']['percentage']:.2f}% ({context['attendance']['presentClasses']}/{context['attendance']['totalClasses']} classes)."
    elif "performance" in message_lower or "risk" in message_lower:
        return f"Your current risk level is {context['performance']['riskLevel']}."
    elif "help" in message_lower or "recommendation" in message_lower:
        return "Keep maintaining good attendance and study habits. Don't hesitate to ask for help when you need it."
    else:
        return "I'm here to help you with your academic performance and attendance. You can ask about your attendance status, performance metrics, or get personalized recommendations."

# API Endpoints
@app.get("/")
async def root():
    return {
        "message": "CentriFlow AI Service is running",
        "version": "1.0.0",
        "status": "healthy"
    }

@app.get("/health")
async def health_check():
    return {
        "status": "healthy",
        "timestamp": "2024-01-01T00:00:00Z",
        "service": "CentriFlow AI Service"
    }

@app.post("/predict", response_model=PredictionResponse)
async def predict_student_performance(request: PredictionRequest):
    """Generate AI-powered predictions for student performance"""
    try:
        student = request.student
        
        # Create prompt for Groq
        prediction_prompt = f"""
        Based on the following student data, provide a comprehensive academic risk assessment and prediction:
        
        Student Information:
        - Name: {student.name}
        - Attendance Percentage: {student.attendancePercentage}%
        - Total Classes: {student.totalClasses}
        - Present Classes: {student.presentClasses}
        - Average Grades: {student.averageGrades}
        - Recent Attendance Trend: {', '.join([a['status'] for a in student.recentAttendance])}
        
        Please analyze and provide:
        1. Risk Level (low/medium/high)
        2. Risk Score (0-100)
        3. Dropout Risk Percentage
        4. Performance Prediction (0-100)
        5. Performance Trend (improving/stable/declining)
        6. 3-4 Specific Recommendations
        
        Respond in JSON format with these exact keys: riskLevel, riskScore, dropoutRisk, performancePrediction, performanceTrend, recommendations
        """
        
        messages = [
            {
                "role": "system",
                "content": "You are an AI assistant that analyzes student performance data and provides risk assessments. Always respond in valid JSON format."
            },
            {
                "role": "user",
                "content": prediction_prompt
            }
        ]
        
        # Call Groq API
        groq_response = call_groq_api(messages, model=GROQ_MODEL)
        
        if groq_response["success"]:
            try:
                # Parse JSON response
                prediction = json.loads(groq_response["content"])
                return PredictionResponse(success=True, prediction=prediction)
            except json.JSONDecodeError:
                print("Failed to parse Groq response as JSON, using fallback")
                return get_fallback_prediction(student)
        else:
            print(f"Groq API error: {groq_response.get('error', 'Unknown error')}")
            return get_fallback_prediction(student)
    
    except Exception as e:
        print(f"Prediction error: {str(e)}")
        return get_fallback_prediction(student)

@app.post("/chat", response_model=ChatResponse)
async def chat_with_ai(request: ChatRequest):
    """AI chatbot for student assistance"""
    try:
        message = request.message
        context = request.context
        
        # Create context-aware prompt
        system_prompt = f"""
        You are an AI assistant for CentriFlow, an educational ERP system. 
        You help students with their academic performance, attendance, and provide personalized recommendations.
        
        Student Context:
        - Name: {context['user']['name']}
        - Role: {context['user']['role']}
        - Current Attendance: {context['attendance']['percentage']:.2f}%
        - Classes Attended: {context['attendance']['presentClasses']}/{context['attendance']['totalClasses']}
        - Risk Level: {context['performance']['riskLevel']}
        - Risk Score: {context['performance']['riskScore']}
        
        Be helpful, encouraging, and provide actionable advice. Keep responses concise but informative.
        """
        
        messages = [
            {"role": "system", "content": system_prompt},
            {"role": "user", "content": message}
        ]
        
        # Call Groq API
        groq_response = call_groq_api(messages)
        
        if groq_response["success"]:
            ai_response = groq_response["content"].strip()
        else:
            # Fallback to rule-based responses
            ai_response = generate_fallback_response(message, context)
        
        return ChatResponse(success=True, response=ai_response)
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chat service failed: {str(e)}")

# @app.post("/face-recognition", response_model=FaceRecognitionResponse)
# async def recognize_face(request: FaceRecognitionRequest):
#     """Face recognition for attendance system"""
#     try:
#         # Decode base64 image
#         image_data = base64.b64decode(request.image)
#         image = Image.open(BytesIO(image_data))
#         
#         # Convert to OpenCV format
#         opencv_image = cv2.cvtColor(np.array(image), cv2.COLOR_RGB2BGR)
#         
#         # Find face locations
#         face_locations = face_recognition.face_locations(opencv_image)
#         
#         if not face_locations:
#             return FaceRecognitionResponse(
#                 success=False,
#                 message="No face detected in the image"
#             )
#         
#         # Get face encodings
#         face_encodings = face_recognition.face_encodings(opencv_image, face_locations)
#         
#         if not face_encodings:
#             return FaceRecognitionResponse(
#                 success=False,
#                 message="Could not encode face features"
#             )
#         
#         # For demo purposes, return a mock student
#         # In production, compare with known faces database
#         mock_student = {
#             "_id": "64a1b2c3d4e5f6789012345",
#             "name": "Demo Student",
#             "email": "demo@centriflow.com",
#             "confidence": 95.5
#         }
#         
#         return FaceRecognitionResponse(
#             success=True,
#             student=mock_student,
#             confidence=95.5,
#             message="Face recognized successfully"
#         )
#     
#     except Exception as e:
#         return FaceRecognitionResponse(
#             success=False,
#             message=f"Face recognition failed: {str(e)}"
#         )

# @app.post("/register-face")
# async def register_face(
#     student_id: str,
#     image: UploadFile = File(...)
# ):
#     """Register a student's face for recognition"""
#     try:
#         # Read image
#         image_data = await image.read()
#         
#         # Process image and extract face encoding
#         image_pil = Image.open(BytesIO(image_data))
#         opencv_image = cv2.cvtColor(np.array(image_pil), cv2.COLOR_RGB2BGR)
#         
#         # Find face locations
#         face_locations = face_recognition.face_locations(opencv_image)
#         
#         if not face_locations:
#             raise HTTPException(status_code=400, detail="No face detected in the image")
#         
#         if len(face_locations) > 1:
#             raise HTTPException(status_code=400, detail="Multiple faces detected. Please provide an image with only one face.")
#         
#         # Get face encoding
#         face_encodings = face_recognition.face_encodings(opencv_image, face_locations)
#         
#         if not face_encodings:
#             raise HTTPException(status_code=400, detail="Could not extract face features")
#         
#         # Store face encoding (in production, use database)
#         known_faces[student_id] = {
#             "encoding": face_encodings[0].tolist(),
#             "registered_at": "2024-01-01T00:00:00Z"
#         }
#         
#         return {
#             "success": True,
#             "message": "Face registered successfully",
#             "student_id": student_id
#         }
#     
#     except HTTPException:
#         raise
#     except Exception as e:
#         raise HTTPException(status_code=500, detail=f"Face registration failed: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)
