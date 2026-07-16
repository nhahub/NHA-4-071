import axios from 'axios';
import { ZodError } from 'zod';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

apiClient.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('accessToken');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

let isRedirecting = false;

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401 && !isRedirecting) {
      isRedirecting = true;
      localStorage.removeItem('accessToken');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchService = async (endpoint, options, schema = null) => {
  try {
    const response = await apiClient(endpoint, options);

    const envelope = response.data;
    const hasEnvelope =
      envelope &&
      typeof envelope === 'object' &&
      'success' in envelope &&
      'data' in envelope;
    const payload = hasEnvelope ? envelope.data : envelope;

    if (schema) {
      const validatedData = schema.parse(payload);
      return { success: true, data: validatedData };
    }

    return { success: true, data: payload };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Data Validation Failed:', error.issues);
      return { success: false, error: 'Received invalid data from server.' };
    }

    return {
      success: false,
      error: error.response?.data?.message || 'Network Error',
    };
  }
};
