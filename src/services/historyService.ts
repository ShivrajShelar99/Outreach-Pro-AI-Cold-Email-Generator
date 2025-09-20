import axios from 'axios';
import Cookies from 'js-cookie';
import { GeneratedEmailData } from '../pages/Dashboard';

const API_BASE_URL = 'http://localhost:8000/api';

const getAuthHeaders = () => {
  const token = Cookies.get('auth-token');
  return token ? { Authorization: `Bearer ${token}` } : {};
};

export const historyService = {
  async getHistory(): Promise<GeneratedEmailData[]> {
    const response = await axios.get(`${API_BASE_URL}/history`, {
      headers: getAuthHeaders(),
    });
    return response.data.emails;
  },

  async saveEmail(email: GeneratedEmailData): Promise<void> {
    await axios.post(`${API_BASE_URL}/history`, email, {
      headers: getAuthHeaders(),
    });
  },
};