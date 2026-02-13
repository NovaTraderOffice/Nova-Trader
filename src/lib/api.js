import axios from 'axios';

const API_BASE_URL = 'https://nova-trader-production.up.railway.app/api';
export const API_URL = API_BASE_URL;

export const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: getHeaders(),
});

api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

export default api;