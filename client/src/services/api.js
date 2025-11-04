import axios from 'axios';

export const createApiClient = (token) => {
  const client = axios.create({
    baseURL: '/api',
  });

  if (token) {
    client.defaults.headers.common.Authorization = `Bearer ${token}`;
  }

  client.interceptors.response.use(
    (response) => response,
    (error) => {
      const message = error.response?.data?.message || error.message;
      return Promise.reject(new Error(message));
    }
  );

  return client;
};
