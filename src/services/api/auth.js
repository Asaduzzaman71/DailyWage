import { Api } from './apiHandler';

export const authService = {
  login: (payload) => Api().post('/auth/login', payload),
  register: (payload) => Api().post('/auth/register', payload),
  refreshToken: () => Api().post('/auth/refresh'),
  logout: () => Api().post('/auth/logout'),
  getProfile: () => Api().get('/auth/me')
};