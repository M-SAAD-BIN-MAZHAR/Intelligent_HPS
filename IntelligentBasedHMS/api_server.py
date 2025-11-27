"""
Unified FastAPI Server for Healthcare Application
Combines all ML models and adds authentication endpoints
"""
import sys
import os
from pathlib import Path
from typing import Optional
import pickle
import pandas as pd
import numpy as np
import io
from datetime import datetime, timedelta
from PIL import Image
import psycopg2
from psycopg2.extras import RealDictCursor

import uvicorn
from fastapi import FastAPI, File, UploadFile, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.responses import JSONResponse
from pydantic import BaseModel, Field
import tensorflow as tf

# Add parent directory to sys.path
sys.path.append(os.path.dirname(__file__))

# Import database functions
from database import authenticate_user, create_user, get_user_by_email, check_database_connection

# ============================================================================
# Database Configuration
# ============================================================================
DB_CONFIG = {
    'database': 'HMS_DATABASE',
    'user': 'postgres',
    'password': '1234',
    'host': 'localhost',
    'port': '5432'
}

def get_db_connection():
    """Create a database connection"""
    try:
        conn = psycopg2.connect(**DB_CONFIG)
        return conn
    except Exception as e:
        print(f"Database connection error: {e}")
        return None

def init_database():
    """Initialize database and ensure table exists"""
    try:
        conn = get_db_connection()
        if not conn:
            print("✗ Database connection failed")
            return False
        
        curr = conn.cursor()
        create_table_query = """
        CREATE TABLE IF NOT EXISTS PATIENT_DATA (
            Patient_ID INTEGER PRIMARY KEY,
            First_Name VARCHAR(50),
            Last_Name VARCHAR(50),
            Email VARCHAR(100) UNIQUE,
            Phone VARCHAR(15),
            Home_Address TEXT,
            Emergency_Contact VARCHAR(15),
            Date_of_Birth DATE,
            Gender VARCHAR(10),
            Blood_Type VARCHAR(10),
            Password VARCHAR(255)
        )
        """
        curr.execute(create_table_query)
        conn.commit()
        curr.close()
        conn.close()
        print("✓ PostgreSQL database initialized successfully")
        return True
    except Exception as e:
        print(f"✗ Database initialization error: {e}")
        return False

def init_database():
    """Initialize database tables"""
    conn = get_db_connection()
    if conn:
        try:
            curr = conn.cursor()
            create_table_query = """
            CREATE TABLE IF NOT EXISTS PATIENT_DATA (
                Patient_ID INTEGER PRIMARY KEY,
                First_Name VARCHAR(50),
                Last_Name VARCHAR(50),
                Email VARCHAR(100) UNIQUE,
                Phone VARCHAR(15),
                Home_Address TEXT,
                Emergency_Contact VARCHAR(15),
                Date_of_Birth DATE,
                Gender VARCHAR(10),
                Blood_Type VARCHAR(10),
                Password VARCHAR(255)
            )
            """
            curr.execute(create_table_query)
            conn.commit()
            curr.close()
            conn.close()
            print("✓ Database tables initialized")
        except Exception as e:
            print(f"✗ Database initialization error: {e}")
    else:
        print("✗ Could not connect to database")

# ============================================================================
# FastAPI App Configuration
# ============================================================================
app = FastAPI(
    title="Smart Healthcare API",
    description="AI-powered healthcare services API",
    version="1.0.0"
)

# CORS Configuration - Allow React app to connect
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # React dev server
        "http://localhost:3000",  # Alternative React port
        "http://localhost:8501",  # Streamlit (if still needed)
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

security = HTTPBearer()

# ============================================================================
# Load ML Models
# ============================================================================
print("Loading ML models...")

# Health Risk Model
try:
    health_risk_model = pickle.load(open("xgb_model.pkl", "rb"))
    print("✓ Health risk model loaded")
except Exception as e:
    print(f"✗ Health risk model failed to load: {e}")
    health_risk_model = None

# Depression Model
try:
    depression_model = pickle.load(open("pipe.pkl", "rb"))
    print("✓ Depression model loaded")
except Exception as e:
    print(f"✗ Depression model failed to load: {e}")
    depression_model = None

# Pneumonia Model
try:
    pneumonia_model = tf.keras.models.load_model("pneumonia_model_custom.h5")
    print("✓ Pneumonia model loaded")
except Exception as e:
    print(f"✗ Pneumonia model failed to load: {e}")
    pneumonia_model = None

print("Model loading complete!\n")

# Initialize database
init_database()

# ============================================================================
# Pydantic Models (Request/Response schemas)
# ============================================================================

# Authentication Models
class LoginRequest(BaseModel):
    email: str
    password: str

class RegisterRequest(BaseModel):
    firstName: str
    lastName: str
    email: str
    phone: str
    address: str
    emergencyContact: str
    dateOfBirth: str
    gender: str
    bloodType: str
    patientId: str
    password: str

class AuthResponse(BaseModel):
    user: dict
    token: str
    refreshToken: str

# Health Risk Model
class HealthRiskRequest(BaseModel):
    age: int
    weight: int
    height: int
    exercise: int
    sleep: int
    sugar_intake: int
    bmi: float
    smoking: int  # 0 or 1
    alcohol: int  # 0 or 1
    profession_doctor: int = 0
    profession_driver: int = 0
    profession_engineer: int = 0
    profession_farmer: int = 0
    profession_office_worker: int = 0
    profession_student: int = 0
    profession_teacher: int = 0

# Depression Model
class DepressionRequest(BaseModel):
    gender: str
    age: int
    profession: str
    sleep: int
    dietary: str
    succide: str
    work_hours: int
    financial: int
    family: str
    pressure: int
    satisfaction: int

# ============================================================================
# Helper Functions
# ============================================================================

def create_mock_token(email: str) -> str:
    """Create a simple mock token (in production, use JWT)"""
    return f"mock_token_{email}_{datetime.now().timestamp()}"

def verify_token(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Verify authentication token (mock implementation)"""
    # In production, verify JWT token here
    if not credentials or not credentials.credentials.startswith("mock_token_"):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Invalid authentication credentials"
        )
    return credentials.credentials

# ============================================================================
# Authentication Endpoints
# ============================================================================

@app.post("/auth/login", response_model=AuthResponse)
async def login(request: LoginRequest):
    """
    Login endpoint - Authenticate against PostgreSQL database
    """
    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed. Please ensure PostgreSQL is running."
        )
    
    try:
        curr = conn.cursor(cursor_factory=RealDictCursor)
        curr.execute(
            "SELECT * FROM PATIENT_DATA WHERE Email = %s AND Password = %s",
            (request.email, request.password)
        )
        user_data = curr.fetchone()
        curr.close()
        conn.close()
        
        if not user_data:
            raise HTTPException(
                status_code=401,
                detail="Invalid email or password"
            )
        
        # Convert database record to user object
        user = {
            "id": str(user_data['patient_id']),
            "patientId": str(user_data['patient_id']),
            "firstName": user_data['first_name'],
            "lastName": user_data['last_name'],
            "email": user_data['email'],
            "phone": user_data['phone'],
            "address": user_data['home_address'],
            "emergencyContact": user_data['emergency_contact'],
            "dateOfBirth": user_data['date_of_birth'].isoformat() if user_data['date_of_birth'] else None,
            "gender": user_data['gender'],
            "bloodType": user_data['blood_type'],
            "role": "patient",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        token = create_mock_token(request.email)
        
        return AuthResponse(
            user=user,
            token=token,
            refreshToken=f"refresh_{token}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Login failed: {str(e)}"
        )

@app.post("/auth/register", response_model=AuthResponse)
async def register(request: RegisterRequest):
    """
    Registration endpoint - Save to PostgreSQL database
    """
    conn = get_db_connection()
    if not conn:
        raise HTTPException(
            status_code=503,
            detail="Database connection failed. Please ensure PostgreSQL is running."
        )
    
    try:
        curr = conn.cursor()
        
        # Check if email already exists
        curr.execute("SELECT Email FROM PATIENT_DATA WHERE Email = %s", (request.email,))
        if curr.fetchone():
            curr.close()
            conn.close()
            raise HTTPException(
                status_code=400,
                detail="Email already registered"
            )
        
        # Check if patient ID already exists
        curr.execute("SELECT Patient_ID FROM PATIENT_DATA WHERE Patient_ID = %s", (int(request.patientId),))
        if curr.fetchone():
            curr.close()
            conn.close()
            raise HTTPException(
                status_code=400,
                detail="Patient ID already exists"
            )
        
        # Insert new patient
        insert_query = """
            INSERT INTO PATIENT_DATA 
            (Patient_ID, First_Name, Last_Name, Email, Phone, Home_Address, 
             Emergency_Contact, Date_of_Birth, Gender, Blood_Type, Password)
            VALUES (%s, %s, %s, %s, %s, %s, %s, %s, %s, %s, %s)
        """
        curr.execute(insert_query, (
            int(request.patientId),
            request.firstName,
            request.lastName,
            request.email,
            request.phone,
            request.address,
            request.emergencyContact,
            request.dateOfBirth,
            request.gender,
            request.bloodType,
            request.password
        ))
        conn.commit()
        curr.close()
        conn.close()
        
        # Create user object for response
        user = {
            "id": request.patientId,
            "patientId": request.patientId,
            "firstName": request.firstName,
            "lastName": request.lastName,
            "email": request.email,
            "phone": request.phone,
            "address": request.address,
            "emergencyContact": request.emergencyContact,
            "dateOfBirth": request.dateOfBirth,
            "gender": request.gender,
            "bloodType": request.bloodType,
            "role": "patient",
            "createdAt": datetime.now().isoformat(),
            "updatedAt": datetime.now().isoformat()
        }
        
        token = create_mock_token(request.email)
        
        return AuthResponse(
            user=user,
            token=token,
            refreshToken=f"refresh_{token}"
        )
    except HTTPException:
        raise
    except Exception as e:
        raise HTTPException(
            status_code=500,
            detail=f"Registration failed: {str(e)}"
        )

# ============================================================================
# Health Risk Prediction Endpoint
# ============================================================================

@app.post("/health-risk/predict")
async def predict_health_risk(request: HealthRiskRequest):
    """Predict health risk based on lifestyle factors"""
    if health_risk_model is None:
        raise HTTPException(
            status_code=503,
            detail="Health risk model not available"
        )
    
    try:
        # Convert to DataFrame with correct column names for the model
        data_dict = request.dict()
        
        # Transform column names to match model's expected features
        transformed_data = {
            'age': data_dict['age'],
            'weight': data_dict['weight'],
            'height': data_dict['height'],
            'exercise': data_dict['exercise'],
            'sleep': data_dict['sleep'],
            'sugar_intake': data_dict['sugar_intake'],
            'bmi_recalc': data_dict['bmi'],  # Model expects bmi_recalc
            'smoking_yes': data_dict['smoking'],  # Model expects smoking_yes
            'alcohol_yes': data_dict['alcohol'],  # Model expects alcohol_yes
            'profession_doctor': data_dict['profession_doctor'],
            'profession_driver': data_dict['profession_driver'],
            'profession_engineer': data_dict['profession_engineer'],
            'profession_farmer': data_dict['profession_farmer'],
            'profession_office_worker': data_dict['profession_office_worker'],
            'profession_student': data_dict['profession_student'],
            'profession_teacher': data_dict['profession_teacher'],
        }
        
        input_df = pd.DataFrame([transformed_data])
        
        # Predict
        prediction = health_risk_model.predict(input_df)[0]
        risk_status = "High Risk" if prediction == 1 else "Low Risk/Save"
        
        return {
            "riskPrediction": int(prediction),
            "riskStatus": risk_status
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Prediction failed: {str(e)}")

# ============================================================================
# Depression Assessment Endpoint
# ============================================================================

@app.post("/depression/assess")
async def assess_depression(request: DepressionRequest):
    """Assess depression risk"""
    if depression_model is None:
        raise HTTPException(
            status_code=503,
            detail="Depression model not available. The model failed to load due to a scikit-learn version mismatch. Please retrain the model with the current scikit-learn version or downgrade to version 1.6.1."
        )
    
    try:
        # Convert to DataFrame with correct column names
        input_df = pd.DataFrame([{
            'Gender': request.gender,
            'Age': request.age,
            'Working Professional or Student': request.profession,
            'Sleep Duration': request.sleep,
            'Dietary Habits': request.dietary,
            'Have you ever had suicidal thoughts ?': request.succide,
            'Work/Study Hours': request.work_hours,
            'Financial Stress': request.financial,
            'Family History of Mental Illness': request.family,
            'Pressure': request.pressure,
            'Satisfaction': request.satisfaction
        }])
        
        # Predict with probability if available
        if hasattr(depression_model, "predict_proba"):
            probability = float(depression_model.predict_proba(input_df)[0][1])
            threshold = 0.24
            prediction = 1 if probability >= threshold else 0
            risk_status = "High Risk" if prediction == 1 else "Low Risk"
            
            return {
                "riskPrediction": prediction,
                "probability": probability,
                "riskStatus": risk_status
            }
        else:
            prediction = int(depression_model.predict(input_df)[0])
            risk_status = "High Risk" if prediction == 1 else "Low Risk"
            
            return {
                "riskPrediction": prediction,
                "riskStatus": risk_status
            }
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Assessment failed: {str(e)}")

# ============================================================================
# Pneumonia Detection Endpoint
# ============================================================================

def preprocess_image(file_bytes: bytes, target_size=(150, 150)):
    """Preprocess image for pneumonia detection"""
    try:
        image = Image.open(io.BytesIO(file_bytes)).convert("RGB")
        image = image.resize(target_size)
        arr = np.array(image).astype("float32") / 255.0
        arr = np.expand_dims(arr, axis=0)
        return arr
    except Exception as e:
        raise ValueError(f"Unable to process image: {e}")

@app.post("/pneumonia/detect")
async def detect_pneumonia(file: UploadFile = File(...)):
    """Detect pneumonia from chest X-ray image"""
    if pneumonia_model is None:
        raise HTTPException(
            status_code=503,
            detail="Pneumonia model not available"
        )
    
    # Validate file type
    if not file.content_type.startswith("image/"):
        raise HTTPException(status_code=400, detail="File must be an image")
    
    try:
        # Read and preprocess image
        contents = await file.read()
        processed_image = preprocess_image(contents)
        
        # Predict
        prediction = pneumonia_model.predict(processed_image)
        probability = float(prediction[0][0])
        
        # Classify based on threshold
        label = "Pneumonia" if probability > 0.8 else "Normal"
        
        return {
            "probability": probability,
            "label": label,
            "imagePreview": "data:image/jpeg;base64,..."  # In production, return base64
        }
    except ValueError as e:
        raise HTTPException(status_code=400, detail=str(e))
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Detection failed: {str(e)}")

# ============================================================================
# Health Check Endpoint
# ============================================================================

@app.get("/health")
async def health_check():
    """Check API and model status"""
    return {
        "status": "healthy",
        "models": {
            "health_risk": health_risk_model is not None,
            "depression": depression_model is not None,
            "pneumonia": pneumonia_model is not None
        }
    }

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "Smart Healthcare API",
        "version": "1.0.0",
        "docs": "/docs"
    }

# ============================================================================
# Run Server
# ============================================================================

if __name__ == "__main__":
    print("\n" + "="*60)
    print("🏥 Smart Healthcare API Server")
    print("="*60)
    print("📍 Server: http://localhost:8000")
    print("📚 API Docs: http://localhost:8000/docs")
    print("🔧 Health Check: http://localhost:8000/health")
    print("="*60 + "\n")
    
    uvicorn.run(
        "api_server:app",
        host="0.0.0.0",
        port=8000,
        reload=True,
        log_level="info"
    )


# ============================================================================
# Chatbot Endpoints - Full RAG Integration
# ============================================================================

# Import the LangGraph chatbot
try:
    # Add pages directory to Python path
    import sys
    pages_path = os.path.join(os.path.dirname(__file__), 'pages')
    if pages_path not in sys.path:
        sys.path.insert(0, pages_path)
    
    from backEnd import chatbot, retrieve_all_threads
    from langchain_core.messages import HumanMessage
    CHATBOT_AVAILABLE = True
    print("✓ RAG Chatbot loaded successfully")
except Exception as e:
    CHATBOT_AVAILABLE = False
    print(f"✗ RAG Chatbot failed to load: {e}")
    print("  Chatbot will use fallback responses")

class ChatRequest(BaseModel):
    message: str
    thread_id: Optional[str] = None

class ChatResponse(BaseModel):
    thread_id: str
    assistant: str

@app.post("/chat", response_model=ChatResponse)
async def chat_endpoint(req: ChatRequest):
    """
    Chat with the medical assistant using RAG (Retrieval Augmented Generation)
    """
    if not req.message:
        raise HTTPException(status_code=400, detail="Message is required")
    
    # Generate a thread ID if not provided
    from uuid import uuid4
    thread_id = req.thread_id or str(uuid4())
    
    if not CHATBOT_AVAILABLE:
        # Fallback response if chatbot failed to load
        assistant_text = "I'm Dr. Spark, your AI Medical Assistant. However, my full capabilities are currently unavailable. Please ensure all dependencies (LangGraph, Pinecone, HuggingFace) are properly configured."
        return ChatResponse(thread_id=thread_id, assistant=assistant_text)
    
    try:
        # Build the human message for LangGraph
        human_msg = HumanMessage(content=req.message)
        
        CONFIG = {
            "configurable": {"thread_id": thread_id},
            "metadata": {"thread_id": thread_id},
            "run_name": "chat_turn",
        }
        
        # Call the LangGraph chatbot with RAG
        assistant_parts = []
        for msg_chunk, metadata in chatbot.stream(
            {"messages": [human_msg]},
            config=CONFIG,
            stream_mode='messages'
        ):
            if hasattr(msg_chunk, 'content'):
                assistant_parts.append(msg_chunk.content)
        
        assistant_text = "".join(assistant_parts)
        
        # If no response, provide a default
        if not assistant_text.strip():
            assistant_text = "I apologize, but I wasn't able to generate a response. Please try rephrasing your question."
        
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Chatbot error: {str(e)}")
    
    return ChatResponse(thread_id=thread_id, assistant=assistant_text)

@app.get("/threads")
async def get_threads():
    """Return all existing conversation thread IDs"""
    if not CHATBOT_AVAILABLE:
        return {"threads": []}
    
    try:
        threads = retrieve_all_threads()
        return {"threads": threads}
    except Exception as e:
        return {"threads": [], "error": str(e)}
