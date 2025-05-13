import axios from 'axios';
import { getToken, removeToken } from '../utils/tokenUtils';

const API_URL = 'http://localhost:8080/api/v1';

const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add auth token to requests
api.interceptors.request.use(
  (config) => {
    const token = getToken();
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// Handle response errors
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response) {
      // Handle 401 unauthorized errors (expired token, etc.)
      if (error.response.status === 401) {
        removeToken();
        window.location.href = '/login';
      }

      // Return more specific error messages when available
      if (error.response.data && error.response.data.message) {
        return Promise.reject(new Error(error.response.data.message));
      }
    }

    return Promise.reject(
      new Error(error.message || 'An unexpected error occurred')
    );
  }
);

export default api;