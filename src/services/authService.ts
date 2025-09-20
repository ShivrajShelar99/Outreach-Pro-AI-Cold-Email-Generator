import axios from 'axios';

const API_BASE_URL = 'http://localhost:8000/api';

export interface AuthResponse {
  token: string;
  user: {
    id: string;
    email: string;
    name: string;
    preferences: {
      tone: string;
      language: string;
      emailLength: string;
    };
  };
}

export const authService = {
  async login(email: string, password: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/login`, {
      email,
      password,
    });
    return response.data;
  },

  async signup(email: string, password: string, name: string): Promise<AuthResponse> {
    const response = await axios.post(`${API_BASE_URL}/auth/signup`, {
      email,
      password,
      name,
    });
    return response.data;
  },

  async verifyToken(token: string): Promise<AuthResponse['user']> {
    const response = await axios.get(`${API_BASE_URL}/auth/verify`, {
      headers: { Authorization: `Bearer ${token}` },
    });
    return response.data;
  },
};