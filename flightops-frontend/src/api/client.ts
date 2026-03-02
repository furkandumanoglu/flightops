import axios from 'axios';

const API_CLIENT = axios.create({
  baseURL: `${import.meta.env.VITE_API_URL}/api`,
  withCredentials: true, // Matching backend CORS config
  headers: {
    'Content-Type': 'application/json',
  },
});

// Add a request interceptor to attach JWT token
API_CLIENT.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

export default API_CLIENT;
