import axios from 'axios';

const instance = axios.create({
  baseURL: 'http://localhost:3000', // O tu URL de producción
  timeout: 5000,
  headers: {
    'Content-Type': 'application/json',
  }
});

// Interceptor para añadir el token automáticamente
instance.interceptors.request.use(config => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
}, error => {
  return Promise.reject(error);
});

export default instance;