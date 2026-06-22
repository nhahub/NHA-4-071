import { fetchService } from './genericFetchService';
import { LoginRequestSchema, RegisterRequestSchema, ForgotPasswordRequestSchema } from '../Schemas/RequestSchemas/authSchemas';

export const loginUser = (credentials) => {
  const payload = LoginRequestSchema.parse(credentials);
  return fetchService('/auth/login', { method: 'POST', data: payload });
};

export const registerUser = (data) => {
  const payload = RegisterRequestSchema.parse(data);
  return fetchService('/auth/register', { method: 'POST', data: payload });
};

export const forgotPassword = (data) => {
  const payload = ForgotPasswordRequestSchema.parse(data);
  return fetchService('/auth/forgot-password', { method: 'POST', data: payload });
};

export const logoutUser = () =>
  fetchService('/auth/logout', { method: 'POST' });

export const getCurrentUser = () =>
  fetchService('/auth/me', { method: 'GET' });
