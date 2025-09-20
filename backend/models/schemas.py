from pydantic import BaseModel, EmailStr
from typing import List, Optional, Dict
from datetime import datetime

class LoginRequest(BaseModel):
    email: EmailStr
    password: str

class SignupRequest(BaseModel):
    email: EmailStr
    password: str
    name: str

class ExtractJobsRequest(BaseModel):
    url: str

class JobListing(BaseModel):
    id: str
    title: str
    skills: List[str]
    experience: str
    description: str
    company: str

class GenerateEmailRequest(BaseModel):
    job: JobListing

class GeneratedEmailData(BaseModel):
    id: str
    subject: str
    content: str
    jobListing: JobListing
    portfolioLinks: List[str]
    timestamp: str

class SaveEmailRequest(BaseModel):
    id: str
    subject: str
    content: str
    jobListing: JobListing
    portfolioLinks: List[str]
    timestamp: str

class UserPreferences(BaseModel):
    tone: str = "professional"
    language: str = "english"
    emailLength: str = "medium"

class User(BaseModel):
    id: str
    email: EmailStr
    name: str
    preferences: UserPreferences

class AuthResponse(BaseModel):
    token: str
    user: User