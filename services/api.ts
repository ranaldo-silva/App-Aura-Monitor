// services/api.ts
import axios from 'axios';
import { AutenticacaoService } from './autenticacao';

// Permite override via env (Expo: app.config.js ou --env)
const API_BASE_URL = process.env.API_BASE_URL || 'https://gs-welless-production.up.railway.app';

export const api = axios.create({
  baseURL: API_BASE_URL,
  timeout: 15000,
});

// Interceptor para adicionar Authorization quando disponível
api.interceptors.request.use(
  async config => {
    try {
      // AutenticacaoService.getToken deve retornar token JWT salvo no AsyncStorage
      const token = await AutenticacaoService.getToken?.();
      if (token && config.headers) {
        config.headers.Authorization = `Bearer ${token}`;
      }
    } catch (err) {
      console.warn('Erro ao recuperar token para requisição:', err);
    }
    return config;
  },
  error => Promise.reject(error)
);

api.interceptors.response.use(
  r => r,
  err => {
    if (err?.response?.status === 401) {
    
      console.warn('401 detectado — o usuário pode precisar re-autenticar.');
    }
    return Promise.reject(err);
  }
);
