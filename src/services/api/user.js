import { Api } from './apiHandler';

export const userService = {
  getUserList: (config={}) => Api().get('/users', config),
  getUserById: (id) => Api().get(`/users/${id}`),
  updateUser: (id, payload) => Api().put(`/users/${id}`, payload),
  deleteUser: (id) => Api().delete(`/users/${id}`),
};