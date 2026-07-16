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

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach((prom) => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

apiClient.interceptors.response.use(
  (response) => response,
  async (error) => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then((token) => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return apiClient(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      try {
        const { data } = await axios.post(
          `${apiClient.defaults.baseURL}/auth/refresh`,
          {},
          { withCredentials: true }
        );

        const newToken = data.data?.token;
        if (newToken) {
          localStorage.setItem('accessToken', newToken);
          processQueue(null, newToken);
          originalRequest.headers.Authorization = `Bearer ${newToken}`;
          return apiClient(originalRequest);
        }
      } catch (refreshError) {
        processQueue(refreshError, null);
        localStorage.removeItem('accessToken');
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
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