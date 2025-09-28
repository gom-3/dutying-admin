import axios from 'axios';

export const API_BASE_URL = 'https://dev.api.dutying.net';
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
    'X-Admin-Token': import.meta.env.VITE_APP_ADMIN_TOKEN,
  },
});
