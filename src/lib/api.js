const API_BASE_URL = 'https://nova-trader-backend.onrender.com';

export const API_URL = API_BASE_URL;

export const getHeaders = () => {
  return {
    'Content-Type': 'application/json',
  };
};