import axios from 'axios';

export const API_BASE_URL = import.meta.env.VITE_APP_API_URL;

if (!API_BASE_URL) {
  throw new Error('API_BASE_URL is not set');
}

// 기본 API 클라이언트 생성
export const apiClient = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

// 요청 인터셉터를 사용하여 매 요청마다 토큰 확인
apiClient.interceptors.request.use(
  (config) => {
    // 로컬스토리지에서 토큰을 가져와서 헤더에 설정
    const token = localStorage.getItem('dutying_admin_token');

    if (token) {
      config.headers['X-Admin-Token'] = token;
    }

    return config;
  },
  (error) => {
    return Promise.reject(error);
  },
);
