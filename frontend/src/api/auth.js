import apiClient from './index';

export const login = async (email, password) => {
  const response = await apiClient.post('/admin/auth/login', {
    email,
    password,
  });
  return response.data;
};

export const register = async (email, password, name) => {
  const response = await apiClient.post('/admin/auth/register', {
    email,
    password,
    name,
  });
  return response.data;
}; 