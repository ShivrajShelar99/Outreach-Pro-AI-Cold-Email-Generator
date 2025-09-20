import axios from 'axios';
import Cookies from 'js-cookie';
import { JobListing, GeneratedEmailData } from '../pages/Dashboard';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = Cookies.get('auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const emailService = {
  async extractJobs(url: string): Promise<JobListing[]> {
    const response = await axios.post(
      `${API_BASE_URL}/jobs/extract`,
      { url },
      { headers: getAuthHeaders() }
    );
    return response.data.jobs;
  },

  async generateEmail(job: JobListing): Promise<GeneratedEmailData> {
    const response = await axios.post(
      `${API_BASE_URL}/emails/generate`,
      { job },
      { headers: getAuthHeaders() }
    );
    return response.data;
  },
};