const API_BASE_URL = 'http://localhost:5000/api';

export const API_URL = API_BASE_URL;

export const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};