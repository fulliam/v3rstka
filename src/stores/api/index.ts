import axios from 'axios';
import { useAuthStore } from '@/stores/auth';

export const API = axios.create({
    baseURL: import.meta.env.VITE_API_BASE_URL,
    headers: {
        Accept: 'application/json',
        'Access-Control-Allow-Headers': 'Content-Type',
        'Access-Control-Allow-Origin': '*'
    }
});

API.interceptors.request.use(
    (config) => {
      const authStore = useAuthStore();
      if (authStore.token) {
        config.headers.Authorization = `Bearer ${authStore.token}`;
      }
      return config;
    },
    (error) => Promise.reject(error)
);