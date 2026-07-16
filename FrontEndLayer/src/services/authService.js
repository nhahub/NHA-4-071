import { fetchService } from './genericFetchService';
import { LoginRequestSchema, RegisterRequestSchema, ForgotPasswordRequestSchema, ChangePasswordRequestSchema } from '../Schemas/RequestSchemas/authSchemas';
import { LoginResponseSchema, RegisterResponseSchema, MessageResponseSchema, MeResponseSchema, ForgotPasswordResponseSchema } from '../Schemas/ResponseSchemas/authResponseSchema';

export const loginUser = (credentials) => {
  const payload = LoginRequestSchema.parse(credentials);
  return fetchService('/auth/login', { method: 'POST', data: payload }, LoginResponseSchema);
};

export const registerUser = (data) => {
  const payload = RegisterRequestSchema.parse(data);
  return fetchService('/auth/register', { method: 'POST', data: payload }, RegisterResponseSchema);
};

export const forgotPassword = (data) => {
  const payload = ForgotPasswordRequestSchema.parse(data);
  return fetchService('/auth/forgot-password', { method: 'POST', data: payload }, ForgotPasswordResponseSchema);
};

export const logoutUser = () =>
  fetchService('/auth/logout', { method: 'POST' }, MessageResponseSchema);

export const getCurrentUser = () =>
  fetchService('/auth/me', { method: 'GET' }, MeResponseSchema);

export const changePassword = (data) => {
  const payload = ChangePasswordRequestSchema.parse(data);
  return fetchService('/auth/change-password', { method: 'POST', data: payload });
};

export const refreshAccessToken = () =>
  fetchService('/auth/refresh', { method: 'POST' });
