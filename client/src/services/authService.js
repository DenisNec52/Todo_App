import { createApiClient } from './api.js';

export const loginRequest = async (credentials) => {
  const { data } = await createApiClient().post('/auth/login', credentials);
  return data;
};

export const registerRequest = async (payload) => {
  const { data } = await createApiClient().post('/auth/register', payload);
  return data;
};

export const getProfile = async (token) => {
  const { data } = await createApiClient(token).get('/auth/me');
  return data;
};
