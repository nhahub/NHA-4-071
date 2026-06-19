import { fetchService } from './genericFetchService';
import { LoginRequestSchema } from '../Schemas/RequestSchemas/authSchemas';

export const loginUser = (credentials) => {
  const payload = LoginRequestSchema.parse(credentials);
  return fetchService('/auth/login', { method: 'POST', data: payload });
};

export const logoutUser = () =>
  fetchService('/auth/logout', { method: 'POST' });

export const getCurrentUser = () =>
  fetchService('/auth/me', { method: 'GET' });
