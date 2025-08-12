import axios from 'axios';

// Use explicit env when provided, otherwise default to local backend
const inferLocalBaseUrl = () => {
  const envUrl = import.meta.env.VITE_API_BASE_URL;
  if (envUrl && typeof envUrl === 'string' && envUrl.trim().length > 0) return envUrl;
  return 'http://localhost:8000';
};

const api = axios.create({
  baseURL: inferLocalBaseUrl(),
  withCredentials: true,
});

export const API_BASE_URL = api.defaults.baseURL || '';

export default api;


