import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:5000/api';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// Project API
export const projectAPI = {
  getAll: () => api.get('/projects'),
  getById: (id) => api.get(`/projects/${id}`),
  create: (data) => api.post('/projects', data),
  update: (id, data) => api.put(`/projects/${id}`, data),
  delete: (id) => api.delete(`/projects/${id}`),
};

// Task API
export const taskAPI = {
  getByProject: (projectId) => api.get(`/tasks/project/${projectId}`),
  getById: (id) => api.get(`/tasks/${id}`),
  create: (data) => api.post('/tasks', data),
  update: (id, data) => api.put(`/tasks/${id}`, data),
  bulkUpdate: (tasks) => api.put('/tasks/bulk/update', { tasks }),
  delete: (id) => api.delete(`/tasks/${id}`),
};

// AI API
export const aiAPI = {
  summarize: (projectId) => api.get(`/ai/summarize/${projectId}`),
  ask: (projectId, question) => api.post(`/ai/ask/${projectId}`, { question }),
  analyzeTask: (taskId) => api.get(`/ai/analyze/${taskId}`),
};

export default api;
