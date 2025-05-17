import axios from 'axios';

const api = axios.create({
  baseURL: 'http://localhost:8000',
  withCredentials: true,
});

api.interceptors.request.use(config => {
  config.headers.common['X-Requested-With'] = 'XMLHttpRequest';
  return config;
});

api.interceptors.response.use(
  response => response,
  error => {
    if (!error.response) {
      console.error('Network error:', error);
      throw error;
    }
    return Promise.reject(error);
  }
);

export const useApi = () => ({
  get: async (url: string) => {
    try {
      const response = await api.get(url);
      return response.data;
    } catch (error) {
      console.error('Error fetching data:', error);
      throw error;
    }
  },
  post: async (url: string, data: any) => {
    try {
      const response = await api.post(url, data);
      return response.data;
    } catch (error) {
      console.error('Error posting data:', error);
      throw error;
    }
  },
  put: async (url: string, data: any) => {
    try {
      const response = await api.put(url, data);
      return response.data;
    } catch (error) {
      console.error('Error updating data:', error);
      throw error;
    }
  },
  delete: async (url: string) => {
    try {
      await api.delete(url);
      return true;
    } catch (error) {
      console.error('Error deleting data:', error);
      throw error;
    }
  },
});
