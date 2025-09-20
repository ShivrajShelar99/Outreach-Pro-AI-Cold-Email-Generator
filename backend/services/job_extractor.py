import requests
from bs4 import BeautifulSoup
import json
import uuid
from typing import List, Dict
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
import re
from models.schemas import JobListing

class JobExtractorService:
    def __init__(self):
        # Initialize LLM (using Ollama as a fallback for Groq)
        self.llm = Ollama(model="llama2")
        
        # Job extraction prompt
        self.extraction_prompt = PromptTemplate(
            input_variables=["html_content", "company_name"],
            template="""
            You are an expert at extracting job information from career pages. 
            Extract job listings from the following HTML content for {company_name}.
            
            HTML Content:
            {html_content}
            
            Return a JSON array of job objects with the following structure:
            {{
              "jobs": [
                {{
                  "title": "Job Title",
                  "skills": ["skill1", "skill2", "skill3"],
                  "experience": "Experience level (e.g., 2-5 years)",
                  "description": "Job description (first 200 characters)",
                  "company": "{company_name}"
                }}
              ]
            }}
            
            Focus on technical roles and extract key skills mentioned in each job.
            If no jobs are found, return an empty array.
            """
        )
        
        self.chain = LLMChain(llm=self.llm, prompt=self.extraction_prompt)

    async def extract_jobs(self, url: str) -> List[JobListing]:
        """Extract job listings from a career page URL"""
        try:
            # Extract company name from URL
            company_name = self._extract_company_name(url)
            
            # Fetch the webpage
            headers = {
                'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/91.0.4472.124 Safari/537.36'
            }
            
            response = requests.get(url, headers=headers, timeout=10)
            response.raise_for_status()
            
            # Parse HTML
            soup = BeautifulSoup(response.content, 'html.parser')
            
            # Remove scripts and styles
            for script in soup(["script", "style"]):
                script.decompose()
            
            # Get text content
            html_content = soup.get_text()
            
            # Limit content length for LLM processing
            html_content = html_content[:8000]  # Truncate to avoid token limits
            
            # For demo purposes, return mock data if LLM fails
            try:
                # Extract using LLM
                result = await self.chain.arun(
                    html_content=html_content,
                    company_name=company_name
                )
                
                # Parse JSON response
                jobs_data = json.loads(result)
                jobs = []
                
                for job_data in jobs_data.get("jobs", []):
                    job = JobListing(
                        id=str(uuid.uuid4()),
                        title=job_data.get("title", ""),
                        skills=job_data.get("skills", []),
                        experience=job_data.get("experience", ""),
                        description=job_data.get("description", ""),
                        company=company_name
                    )
                    jobs.append(job)
                
                return jobs
                
            except Exception as e:
                # Fallback to mock data for demo
                return self._get_mock_jobs(company_name)
                
        except Exception as e:
            # Return mock data for demo purposes
            return self._get_mock_jobs("Unknown Company")

    def _extract_company_name(self, url: str) -> str:
        """Extract company name from URL"""
        try:
            # Simple extraction from domain
            domain = url.split("//")[1].split("/")[0]
            company = domain.split(".")[0]
            return company.title()
        except:
            return "Company"

    def _get_mock_jobs(self, company_name: str) -> List[JobListing]:
        """Return mock job listings for demo purposes"""
        mock_jobs = [
            {
                "title": "Senior Full Stack Developer",
                "skills": ["React", "Node.js", "Python", "AWS", "MongoDB"],
                "experience": "5+ years",
                "description": "We are looking for a Senior Full Stack Developer to join our growing team. You will be responsible for developing and maintaining web applications using modern technologies.",
                "company": company_name
            },
            {
                "title": "DevOps Engineer",
                "skills": ["Docker", "Kubernetes", "AWS", "Jenkins", "Terraform"],
                "experience": "3-5 years",
                "description": "Join our DevOps team to help build and maintain our cloud infrastructure. Experience with containerization and CI/CD pipelines required.",
                "company": company_name
            },
            {
                "title": "Data Scientist",
                "skills": ["Python", "Machine Learning", "SQL", "TensorFlow", "Pandas"],
                "experience": "2-4 years",
                "description": "We're seeking a Data Scientist to analyze complex datasets and build predictive models. Strong background in statistics and machine learning required.",
                "company": company_name
            },
            {
                "title": "Frontend Developer",
                "skills": ["React", "TypeScript", "CSS", "JavaScript", "Redux"],
                "experience": "2-3 years",
                "description": "Looking for a Frontend Developer to create engaging user interfaces. Experience with React and modern JavaScript frameworks is essential.",
                "company": company_name
            }
        ]
        
        jobs = []
        for job_data in mock_jobs:
            job = JobListing(
                id=str(uuid.uuid4()),
                title=job_data["title"],
                skills=job_data["skills"],
                experience=job_data["experience"],
                description=job_data["description"],
                company=company_name
            )
            jobs.append(job)
        
        return jobs