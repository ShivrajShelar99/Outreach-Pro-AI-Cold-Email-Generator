from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
from jose import JWTError, jwt
from passlib.context import CryptContext
import os
from dotenv import load_dotenv

from services.job_extractor import JobExtractorService
from services.email_generator import EmailGeneratorService
from services.auth_service import AuthService
from services.history_service import HistoryService
from models.schemas import *

load_dotenv()

app = FastAPI(title="Outreach Pro API", version="1.0.0")

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Security
security = HTTPBearer()
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Services
job_extractor = JobExtractorService()
email_generator = EmailGeneratorService()
auth_service = AuthService()
history_service = HistoryService()

# JWT Configuration
SECRET_KEY = os.getenv("SECRET_KEY", "your-secret-key-here")
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    """Get current user from JWT token"""
    try:
        token = credentials.credentials
        payload = jwt.decode(token, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: str = payload.get("sub")
        if user_id is None:
            raise HTTPException(
                status_code=status.HTTP_401_UNAUTHORIZED,
                detail="Could not validate credentials"
            )
        return user_id
    except JWTError:
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Could not validate credentials"
        )

@app.post("/api/auth/login")
async def login(request: LoginRequest):
    """User login endpoint"""
    try:
        response = await auth_service.login(request.email, request.password)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/auth/signup")
async def signup(request: SignupRequest):
    """User signup endpoint"""
    try:
        response = await auth_service.signup(request.email, request.password, request.name)
        return response
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.get("/api/auth/verify")
async def verify_token(user_id: str = Depends(get_current_user)):
    """Verify JWT token and return user data"""
    try:
        user = await auth_service.get_user_by_id(user_id)
        return user
    except Exception as e:
        raise HTTPException(status_code=400, detail=str(e))

@app.post("/api/jobs/extract")
async def extract_jobs(request: ExtractJobsRequest, user_id: str = Depends(get_current_user)):
    """Extract job listings from career page URL"""
    try:
        jobs = await job_extractor.extract_jobs(request.url)
        return {"jobs": jobs}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to extract jobs: {str(e)}")

@app.post("/api/emails/generate")
async def generate_email(request: GenerateEmailRequest, user_id: str = Depends(get_current_user)):
    """Generate personalized cold email for a job"""
    try:
        email_data = await email_generator.generate_email(request.job, user_id)
        
        # Save to history
        await history_service.save_email(user_id, email_data)
        
        return email_data
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to generate email: {str(e)}")

@app.get("/api/history")
async def get_history(user_id: str = Depends(get_current_user)):
    """Get user's email generation history"""
    try:
        emails = await history_service.get_user_history(user_id)
        return {"emails": emails}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to get history: {str(e)}")

@app.post("/api/history")
async def save_email_to_history(request: SaveEmailRequest, user_id: str = Depends(get_current_user)):
    """Save email to user's history"""
    try:
        await history_service.save_email(user_id, request.dict())
        return {"message": "Email saved successfully"}
    except Exception as e:
        raise HTTPException(status_code=400, detail=f"Failed to save email: {str(e)}")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "timestamp": datetime.now().isoformat()}

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)