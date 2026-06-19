import axios from 'axios';
import { ZodError } from 'zod';
import { installDummyInterceptor } from '../dummyData/dummyApiHandler';

const apiClient = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:5000/api',
  withCredentials: true,
});

if (import.meta.env.VITE_USE_DUMMY_DATA === 'true') {
  console.log('Dummy data mode active — API calls will return mock data');
  installDummyInterceptor(apiClient);
}

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const fetchService = async (endpoint, options, schema = null) => {
  try {
    const response = await apiClient(endpoint, options);

    if (schema) {
      const validatedData = schema.parse(response.data);
      return { success: true, data: validatedData };
    }

    return { success: true, data: response.data };
  } catch (error) {
    if (error instanceof ZodError) {
      console.error('Data Validation Failed:', error.errors);
      return { success: false, error: 'Received invalid data from server.' };
    }

    return {
      success: false,
      error: error.response?.data?.message || 'Network Error',
    };
  }
};
