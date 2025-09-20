import React, { useState } from 'react';
import { toast } from 'react-hot-toast';
import { EmailGenerator } from '../components/EmailGenerator';
import { JobListings } from '../components/JobListings';
import { GeneratedEmail } from '../components/GeneratedEmail';
import { emailService } from '../services/emailService';

export interface JobListing {
  id: string;
  title: string;
  skills: string[];
  experience: string;
  description: string;
  company: string;
}

export interface GeneratedEmailData {
  id: string;
  subject: string;
  content: string;
  jobListing: JobListing;
  portfolioLinks: string[];
  timestamp: string;
}

export const Dashboard: React.FC = () => {
  const [currentStep, setCurrentStep] = useState<'input' | 'jobs' | 'email'>('input');
  const [careerUrl, setCareerUrl] = useState('');
  const [jobListings, setJobListings] = useState<JobListing[]>([]);
  const [selectedJob, setSelectedJob] = useState<JobListing | null>(null);
  const [generatedEmail, setGeneratedEmail] = useState<GeneratedEmailData | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const handleUrlSubmit = async (url: string) => {
    setIsLoading(true);
    try {
      const jobs = await emailService.extractJobs(url);
      setJobListings(jobs);
      setCareerUrl(url);
      setCurrentStep('jobs');
      toast.success(`Found ${jobs.length} job listings`);
    } catch (error) {
      toast.error('Failed to extract job listings');
    } finally {
      setIsLoading(false);
    }
  };

  const handleJobSelect = async (job: JobListing) => {
    setSelectedJob(job);
    setIsLoading(true);
    try {
      const email = await emailService.generateEmail(job);
      setGeneratedEmail(email);
      setCurrentStep('email');
      toast.success('Email generated successfully!');
    } catch (error) {
      toast.error('Failed to generate email');
    } finally {
      setIsLoading(false);
    }
  };

  const handleReset = () => {
    setCurrentStep('input');
    setCareerUrl('');
    setJobListings([]);
    setSelectedJob(null);
    setGeneratedEmail(null);
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div className="bg-white rounded-xl shadow-sm border border-gray-200 overflow-hidden">
        <div className="bg-gradient-to-r from-blue-600 to-indigo-600 px-6 py-8">
          <h1 className="text-3xl font-bold text-white">Cold Email Generator</h1>
          <p className="text-blue-100 mt-2">
            Transform job listings into personalized outreach opportunities
          </p>
        </div>

        <div className="p-6">
          {/* Progress Steps */}
          <div className="flex items-center justify-center mb-8">
            <div className="flex items-center space-x-4">
              <div className={`flex items-center space-x-2 ${currentStep === 'input' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'input' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  1
                </div>
                <span className="text-sm font-medium">URL Input</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'jobs' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'jobs' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  2
                </div>
                <span className="text-sm font-medium">Job Selection</span>
              </div>
              <div className="w-8 h-0.5 bg-gray-300"></div>
              <div className={`flex items-center space-x-2 ${currentStep === 'email' ? 'text-blue-600' : 'text-gray-400'}`}>
                <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium ${currentStep === 'email' ? 'bg-blue-600 text-white' : 'bg-gray-200'}`}>
                  3
                </div>
                <span className="text-sm font-medium">Email Generation</span>
              </div>
            </div>
          </div>

          {/* Content */}
          {currentStep === 'input' && (
            <EmailGenerator onSubmit={handleUrlSubmit} isLoading={isLoading} />
          )}

          {currentStep === 'jobs' && (
            <JobListings
              jobs={jobListings}
              onSelect={handleJobSelect}
              onBack={() => setCurrentStep('input')}
              isLoading={isLoading}
            />
          )}

          {currentStep === 'email' && generatedEmail && (
            <GeneratedEmail
              email={generatedEmail}
              onReset={handleReset}
              onBack={() => setCurrentStep('jobs')}
            />
          )}
        </div>
      </div>
    </div>
  );
};