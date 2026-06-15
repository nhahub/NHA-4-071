// src/services/genericFetchService.js
import axios from 'axios';
import { ZodError } from 'zod';

// Create a reusable axios instance
const apiClient = axios.create({
  baseURL: 'http://localhost:5000/api', // Your Express backend URL
});

// Attach JWT token automatically
apiClient.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) config.headers.Authorization = `Bearer ${token}`;
  return config;
});

/**
 * The Generic Fetch Function
 * @param {string} endpoint - API route (e.g., '/students/courses')
 * @param {object} options - Axios config (method, data, etc.)
 * @param {object} schema - Zod schema to validate the RESPONSE
 */
export const fetchService = async (endpoint, options, schema = null) => {
  try {
    const response = await apiClient(endpoint, options);
    
    // If a Zod Response schema is provided, validate the data
    if (schema) {
      const validatedData = schema.parse(response.data);
      return { success: true, data: validatedData };
    }

    return { success: true, data: response.data };
    
  } catch (error) {
    // Handle Zod Validation Errors (Bad data from backend)
    if (error instanceof ZodError) {
      console.error("Data Validation Failed:", error.errors);
      return { success: false, error: "Received invalid data from server." };
    }
    
    // Handle Axios/API Errors
    return { success: false, error: error.response?.data?.message || "Network Error" };
  }
};