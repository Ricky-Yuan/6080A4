import React, { createContext, useContext, useState, useEffect } from 'react';
import { login as apiLogin, register as apiRegister, logout as apiLogout, getCurrentUser } from '../api/auth';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [currentUser, setCurrentUser] = useState(() => {
    const savedUser = localStorage.getItem('currentUser');
    return savedUser ? JSON.parse(savedUser) : null;
  });
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    if (currentUser) {
      localStorage.setItem('currentUser', JSON.stringify(currentUser));
    } else {
      localStorage.removeItem('currentUser');
    }
  }, [currentUser]);

  const login = async (email, password) => {
    setLoading(true);
    try {
      const response = await apiLogin(email, password);
      const { token } = response;
      const user = { email, token: `Bearer ${token}` };
      
      // 先设置到 localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      // 再更新 state
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Login error:', error);
      throw new Error(error.message || 'Invalid email or password');
    } finally {
      setLoading(false);
    }
  };

  const logout = async () => {
    setLoading(true);
    try {
      setCurrentUser(null);
      localStorage.removeItem('currentUser');
      try {
        await apiLogout();
      } catch (error) {
        console.warn('Backend logout failed:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  const register = async (email, password, name) => {
    setLoading(true);
    try {
      const response = await apiRegister(email, password, name);
      const { token } = response;
      const user = { email, name, token: `Bearer ${token}` };
      
      // 先设置到 localStorage
      localStorage.setItem('currentUser', JSON.stringify(user));
      // 再更新 state
      setCurrentUser(user);
      
      return user;
    } catch (error) {
      console.error('Registration error:', error);
      throw new Error(error.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  const value = {
    currentUser,
    loading,
    login,
    logout,
    register
  };

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext; 