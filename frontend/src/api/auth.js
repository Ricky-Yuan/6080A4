import apiClient from './index';

export const login = async (email, password) => {
  const response = await apiClient.post('/admin/auth/login', {
    email,
    password,
  });
  return response;
};

export const register = async (email, password, name) => {
  const response = await apiClient.post('/admin/auth/register', {
    email,
    password,
    name,
  });
  return response;
};

export const logout = async () => {
  const response = await apiClient.post('/admin/auth/logout');
  return response;
};

export const getCurrentUser = async () => {
  const response = await apiClient.get('/admin/auth/current');
  return response;
}; 