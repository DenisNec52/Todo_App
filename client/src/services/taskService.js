import { createApiClient } from './api.js';

export const fetchTasks = async (token, params) => {
  const { data } = await createApiClient(token).get('/tasks', { params });
  return data;
};

export const createTaskRequest = async (token, payload) => {
  const { data } = await createApiClient(token).post('/tasks', payload);
  return data;
};

export const updateTaskRequest = async (token, id, payload) => {
  const { data } = await createApiClient(token).put(`/tasks/${id}`, payload);
  return data;
};

export const deleteTaskRequest = async (token, id) => {
  await createApiClient(token).delete(`/tasks/${id}`);
};
