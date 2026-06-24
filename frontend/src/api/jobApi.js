import axios from 'axios';
import { toast } from 'react-hot-toast';

// Create a centralized axios instance
// Ensure production `VITE_API_URL` uses the `/jobs` prefix so requests
// target the same Express routes mounted under `/jobs`.
const resolvedApiBase = (() => {
  const envUrl = import.meta.env.VITE_API_URL ? import.meta.env.VITE_API_URL.replace(/\/$/, '') : '';
  if (!envUrl) return '/jobs';
  return envUrl.endsWith('/jobs') ? envUrl : envUrl + '/jobs';
})();

const api = axios.create({
  baseURL: resolvedApiBase,
  timeout: 10000, // 10s timeout
  headers: {
    'Content-Type': 'application/json',
  },
});

// Request Interceptor (for debugging/development)
api.interceptors.request.use(
  (config) => {
    if (import.meta.env.DEV) {
      console.log(`[API Request] ${config.method?.toUpperCase()} ${config.url}`, config.data || '');
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response Interceptor for centralized error handling
api.interceptors.response.use(
  (response) => {
    if (import.meta.env.DEV) {
      console.log(`[API Response] ${response.status}`, response.data);
    }
    return response;
  },
  (error) => {
    let message = 'An unexpected error occurred';
    
    if (error.response) {
      // Backend returned an error response (4xx, 5xx)
      const { status, data } = error.response;
      message = data?.message || data?.error || `Server Error: ${status}`;
      console.error(`[API Error Response] ${status}`, data);
    } else if (error.request) {
      // Request was made but no response received (Network Error)
      message = 'Network error: Backend server unreachable';
      console.error('[API Network Error]', error.request);
    } else {
      // Something happened in setting up the request
      message = error.message;
      console.error('[API Setup Error]', error.message);
    }

    return Promise.reject({ ...error, message });
  }
);

export const jobApi = {
  addCampaign: (data) => api.post('/add-campaign', data),
  getStats: () => api.get('/stats'),
  getDeliveryLogs: () => api.get('/all'),
  retryJob: (id) => api.post(`/retry/${id}`),
  deleteJob: (id) => api.delete(`/${id}`),
};

export default api;
