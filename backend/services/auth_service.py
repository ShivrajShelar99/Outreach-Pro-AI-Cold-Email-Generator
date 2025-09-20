import uuid
import hashlib
from datetime import datetime, timedelta
from jose import jwt
from passlib.context import CryptContext
from typing import Dict, Optional
from models.schemas import User, UserPreferences, AuthResponse

class AuthService:
    def __init__(self):
        self.pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
        self.secret_key = "your-secret-key-here"
        self.algorithm = "HS256"
        
        # In-memory user storage (replace with database in production)
        self.users = {}
        self.user_emails = {}

    def _hash_password(self, password: str) -> str:
        return self.pwd_context.hash(password)

    def _verify_password(self, plain_password: str, hashed_password: str) -> bool:
        return self.pwd_context.verify(plain_password, hashed_password)

    def _create_access_token(self, user_id: str) -> str:
        expire = datetime.utcnow() + timedelta(days=7)
        to_encode = {"sub": user_id, "exp": expire}
        encoded_jwt = jwt.encode(to_encode, self.secret_key, algorithm=self.algorithm)
        return encoded_jwt

    async def signup(self, email: str, password: str, name: str) -> AuthResponse:
        # Check if user exists
        if email in self.user_emails:
            raise Exception("User already exists")
        
        # Create new user
        user_id = str(uuid.uuid4())
        hashed_password = self._hash_password(password)
        
        user = User(
            id=user_id,
            email=email,
            name=name,
            preferences=UserPreferences()
        )
        
        # Store user
        self.users[user_id] = {
            "user": user,
            "password": hashed_password
        }
        self.user_emails[email] = user_id
        
        # Create token
        token = self._create_access_token(user_id)
        
        return AuthResponse(token=token, user=user)

    async def login(self, email: str, password: str) -> AuthResponse:
        # Check if user exists
        if email not in self.user_emails:
            raise Exception("Invalid credentials")
        
        user_id = self.user_emails[email]
        stored_data = self.users[user_id]
        
        # Verify password
        if not self._verify_password(password, stored_data["password"]):
            raise Exception("Invalid credentials")
        
        # Create token
        token = self._create_access_token(user_id)
        
        return AuthResponse(token=token, user=stored_data["user"])

    async def get_user_by_id(self, user_id: str) -> User:
        if user_id not in self.users:
            raise Exception("User not found")
        
        return self.users[user_id]["user"]