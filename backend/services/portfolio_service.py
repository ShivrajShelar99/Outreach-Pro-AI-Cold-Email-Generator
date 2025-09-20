import chromadb
from typing import List
from sentence_transformers import SentenceTransformer
import numpy as np

class PortfolioService:
    def __init__(self):
        # Initialize embedding model
        self.embedding_model = SentenceTransformer('all-MiniLM-L6-v2')
        
        # Initialize ChromaDB client (in-memory for demo)
        self.client = chromadb.Client()
        
        # Create or get collection
        try:
            self.collection = self.client.get_collection("portfolio")
        except:
            self.collection = self.client.create_collection("portfolio")
            self._initialize_portfolio_data()

    def _initialize_portfolio_data(self):
        """Initialize portfolio data in the vector database"""
        portfolio_projects = [
            {
                "id": "1",
                "title": "E-commerce Platform Modernization",
                "description": "Modernized legacy e-commerce platform using React, Node.js, and AWS. Improved performance by 60% and reduced server costs by 40%.",
                "technologies": ["React", "Node.js", "AWS", "MongoDB", "Redis"],
                "url": "https://atliq.com/portfolio/ecommerce-modernization"
            },
            {
                "id": "2",
                "title": "DevOps Infrastructure Automation",
                "description": "Implemented CI/CD pipeline using Jenkins, Docker, and Kubernetes. Reduced deployment time from 2 hours to 15 minutes.",
                "technologies": ["Jenkins", "Docker", "Kubernetes", "AWS", "Terraform"],
                "url": "https://atliq.com/portfolio/devops-automation"
            },
            {
                "id": "3",
                "title": "Machine Learning Analytics Dashboard",
                "description": "Built ML-powered analytics dashboard using Python, TensorFlow, and React. Increased business insights by 80%.",
                "technologies": ["Python", "TensorFlow", "React", "PostgreSQL", "Docker"],
                "url": "https://atliq.com/portfolio/ml-dashboard"
            },
            {
                "id": "4",
                "title": "Mobile App Development",
                "description": "Developed cross-platform mobile app using React Native and Firebase. Deployed to 100k+ users with 4.8 star rating.",
                "technologies": ["React Native", "Firebase", "TypeScript", "Redux"],
                "url": "https://atliq.com/portfolio/mobile-app"
            },
            {
                "id": "5",
                "title": "Cloud Migration & Optimization",
                "description": "Migrated on-premise infrastructure to AWS cloud. Achieved 99.9% uptime and 30% cost reduction.",
                "technologies": ["AWS", "Lambda", "RDS", "CloudFormation", "S3"],
                "url": "https://atliq.com/portfolio/cloud-migration"
            },
            {
                "id": "6",
                "title": "Full-Stack Web Application",
                "description": "Built scalable web application using MERN stack. Handles 10k+ concurrent users with real-time features.",
                "technologies": ["MongoDB", "Express.js", "React", "Node.js", "Socket.io"],
                "url": "https://atliq.com/portfolio/fullstack-app"
            }
        ]
        
        # Prepare data for ChromaDB
        documents = []
        metadatas = []
        ids = []
        
        for project in portfolio_projects:
            # Create searchable document
            document = f"{project['title']} {project['description']} {' '.join(project['technologies'])}"
            documents.append(document)
            
            # Metadata
            metadatas.append({
                "title": project["title"],
                "description": project["description"],
                "technologies": ",".join(project["technologies"]),
                "url": project["url"]
            })
            
            ids.append(project["id"])
        
        # Add to collection
        self.collection.add(
            documents=documents,
            metadatas=metadatas,
            ids=ids
        )

    async def get_matching_portfolio(self, job_description: str, skills: List[str]) -> List[str]:
        """Get portfolio links that match job requirements"""
        try:
            # Create search query
            query = f"{job_description} {' '.join(skills)}"
            
            # Search for relevant projects
            results = self.collection.query(
                query_texts=[query],
                n_results=3
            )
            
            # Extract URLs from metadata
            portfolio_links = []
            if results['metadatas']:
                for metadata in results['metadatas'][0]:
                    portfolio_links.append(metadata['url'])
            
            return portfolio_links[:3]  # Return top 3 matches
            
        except Exception as e:
            # Return fallback portfolio links
            return [
                "https://atliq.com/portfolio/web-development",
                "https://atliq.com/portfolio/cloud-solutions",
                "https://atliq.com/portfolio/mobile-apps"
            ]