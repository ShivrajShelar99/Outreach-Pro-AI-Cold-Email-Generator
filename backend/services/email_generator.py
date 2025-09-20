import uuid
from datetime import datetime
from typing import List
from langchain.chains import LLMChain
from langchain.prompts import PromptTemplate
from langchain_community.llms import Ollama
from models.schemas import JobListing, GeneratedEmailData
from services.portfolio_service import PortfolioService

class EmailGeneratorService:
    def __init__(self):
        # Initialize LLM
        self.llm = Ollama(model="llama2")
        
        # Initialize portfolio service
        self.portfolio_service = PortfolioService()
        
        # Email generation prompt
        self.email_prompt = PromptTemplate(
            input_variables=["job_title", "company", "skills", "experience", "description", "portfolio_links"],
            template="""
            You are an expert at writing persuasive cold emails for B2B service companies.
            Write a professional cold email for Atliq, a service company, reaching out to {company} 
            regarding their {job_title} position.

            Job Details:
            - Title: {job_title}
            - Required Skills: {skills}
            - Experience: {experience}
            - Description: {description}

            Relevant Portfolio Links:
            {portfolio_links}

            Email Requirements:
            1. Subject line should be compelling and mention the specific role
            2. Acknowledge their hiring need for {job_title}
            3. Highlight how Atliq can provide dedicated engineers with the exact skills they need
            4. Mention cost savings, speed, and quality benefits
            5. Include relevant portfolio links naturally
            6. End with a clear call-to-action
            7. Keep it professional but friendly
            8. Length: 150-250 words

            Return the email in this format:
            SUBJECT: [subject line]
            
            EMAIL:
            [email content]
            """
        )
        
        self.chain = LLMChain(llm=self.llm, prompt=self.email_prompt)

    async def generate_email(self, job: JobListing, user_id: str) -> GeneratedEmailData:
        """Generate a personalized cold email for a job listing"""
        try:
            # Get matching portfolio links
            portfolio_links = await self.portfolio_service.get_matching_portfolio(
                job.description, job.skills
            )
            
            # Format portfolio links for prompt
            portfolio_text = "\n".join([f"- {link}" for link in portfolio_links])
            if not portfolio_text:
                portfolio_text = "- No specific portfolio links available"
            
            # Generate email using LLM
            try:
                result = await self.chain.arun(
                    job_title=job.title,
                    company=job.company,
                    skills=", ".join(job.skills),
                    experience=job.experience,
                    description=job.description,
                    portfolio_links=portfolio_text
                )
                
                # Parse the result
                lines = result.strip().split('\n')
                subject = ""
                email_content = ""
                
                for i, line in enumerate(lines):
                    if line.startswith("SUBJECT:"):
                        subject = line.replace("SUBJECT:", "").strip()
                    elif line.startswith("EMAIL:"):
                        email_content = "\n".join(lines[i+1:]).strip()
                        break
                
                # Fallback if parsing fails
                if not subject or not email_content:
                    subject, email_content = self._generate_fallback_email(job)
                
            except Exception as e:
                # Fallback to template-based generation
                subject, email_content = self._generate_fallback_email(job)
            
            # Create email data
            email_data = GeneratedEmailData(
                id=str(uuid.uuid4()),
                subject=subject,
                content=email_content,
                jobListing=job,
                portfolioLinks=portfolio_links,
                timestamp=datetime.now().isoformat()
            )
            
            return email_data
            
        except Exception as e:
            # Return fallback email
            subject, email_content = self._generate_fallback_email(job)
            
            return GeneratedEmailData(
                id=str(uuid.uuid4()),
                subject=subject,
                content=email_content,
                jobListing=job,
                portfolioLinks=[],
                timestamp=datetime.now().isoformat()
            )

    def _generate_fallback_email(self, job: JobListing) -> tuple:
        """Generate a fallback email using templates"""
        subject = f"Solve Your {job.title} Hiring Challenge - Atliq Can Help"
        
        email_content = f"""Dear {job.company} Hiring Team,

I noticed you're actively hiring for a {job.title} position. Finding the right talent with skills in {', '.join(job.skills[:3])} can be challenging and time-consuming.

At Atliq, we specialize in providing dedicated engineers who can seamlessly integrate with your team. Instead of spending months on recruitment, we can provide you with pre-vetted professionals who have the exact skills you need.

Our approach offers:
• 50% faster deployment compared to traditional hiring
• Cost savings of up to 40% on recruitment and onboarding
• Access to engineers with proven expertise in {', '.join(job.skills[:2])}
• Flexible engagement models to match your project needs

We've successfully helped companies like yours scale their technical teams efficiently. Our engineers are ready to contribute from day one, ensuring your projects stay on track.

Would you be open to a brief 15-minute call to discuss how we can help solve your {job.title} requirements? I'd love to share specific examples of how we've helped similar companies.

Best regards,
[Your Name]
Atliq Solutions
Email: business@atliq.com
Phone: +1-555-123-4567"""

        return subject, email_content