import { Api } from './apiHandler';

export const userService = {
  getUserList: (config={}) => Api().get('/users', config),
  getUserById: (id) => Api().get(`/users/${id}`),
  // 💡 Corrected function to handle a single argument
  updateUser: (updatedUserData) => {
    // Destructure the id from the rest of the data
    const { id, ...payload } = updatedUserData;
    // Send the put request with the correct endpoint and payload
    return Api().put(`/users/${id}`, payload);
  },
  deleteUser: (id) => Api().delete(`/users/${id}`),
};