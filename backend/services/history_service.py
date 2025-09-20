from typing import List, Dict
from models.schemas import GeneratedEmailData
import json

class HistoryService:
    def __init__(self):
        # In-memory storage (replace with database in production)
        self.user_histories = {}

    async def save_email(self, user_id: str, email_data: GeneratedEmailData) -> None:
        """Save email to user's history"""
        if user_id not in self.user_histories:
            self.user_histories[user_id] = []
        
        # Convert to dict for storage
        email_dict = email_data.dict() if hasattr(email_data, 'dict') else email_data
        
        self.user_histories[user_id].append(email_dict)

    async def get_user_history(self, user_id: str) -> List[GeneratedEmailData]:
        """Get user's email history"""
        if user_id not in self.user_histories:
            return []
        
        # Convert back to GeneratedEmailData objects
        history = []
        for email_dict in self.user_histories[user_id]:
            if isinstance(email_dict, dict):
                history.append(GeneratedEmailData(**email_dict))
            else:
                history.append(email_dict)
        
        # Sort by timestamp (newest first)
        history.sort(key=lambda x: x.timestamp, reverse=True)
        
        return history

    async def delete_email(self, user_id: str, email_id: str) -> bool:
        """Delete email from user's history"""
        if user_id not in self.user_histories:
            return False
        
        original_length = len(self.user_histories[user_id])
        self.user_histories[user_id] = [
            email for email in self.user_histories[user_id] 
            if email.get('id') != email_id
        ]
        
        return len(self.user_histories[user_id]) < original_length