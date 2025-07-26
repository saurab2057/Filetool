// src/communication/AuthContext.jsx
import React, { createContext, useState, useEffect, useContext } from 'react';
import apiClient from '@/communication/api';
import { useNavigate, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);
export const useAuth = () => useContext(AuthContext);

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(localStorage.getItem('accessToken'));
  const [authLoading, setAuthLoading] = useState(true);
  const navigate = useNavigate();
  const location = useLocation();

  const logout = async (shouldNotifyServer = true) => {
    if (shouldNotifyServer) {
      try {
        await apiClient.post('/api/auth/logout');
      } catch (error) {
        console.error('Server logout failed, but clearing client state anyway.', error);
      }
    }
    setUser(null);
    setAccessToken(null);
    localStorage.removeItem('accessToken');
    localStorage.removeItem('user');
    localStorage.removeItem('adminActiveTab');
    delete apiClient.defaults.headers.common['Authorization'];
    setAuthLoading(false);
    navigate('/', { replace: true }); // Use replace to avoid history stack issues
  };

  useEffect(() => {
    let interval;

    // Set up Axios interceptors
    const requestInterceptor = apiClient.interceptors.request.use(
      (config) => {
        const currentToken = localStorage.getItem('accessToken');
        if (currentToken) {
          config.headers['Authorization'] = `Bearer ${currentToken}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    const responseInterceptor = apiClient.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        if (error.response?.status === 401 && !originalRequest._retry) {
          originalRequest._retry = true;
          // Avoid refreshing if user is logged out
          if (!localStorage.getItem('accessToken')) {
            return Promise.reject(error);
          }
          try {
            const { data } = await apiClient.post('/api/auth/refresh-token');
            localStorage.setItem('accessToken', data.accessToken);
            setAccessToken(data.accessToken);
            setUser(data.user);
            localStorage.setItem('user', JSON.stringify(data.user));
            apiClient.defaults.headers.common['Authorization'] = `Bearer ${data.accessToken}`;
            return apiClient(originalRequest);
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError.message);
            await logout(false); // Ensure logout completes
            return Promise.reject(refreshError);
          }
        }
        return Promise.reject(error);
      }
    );

    // Initialize authentication
    const initializeAuth = async () => {
      const tokenExists = !!localStorage.getItem('accessToken');
      if (!tokenExists) {
        setAuthLoading(false);
        return;
      }
      try {
        const { data } = await apiClient.post('/api/auth/refresh-token');
        setAccessToken(data.accessToken);
        setUser(data.user);
        localStorage.setItem('accessToken', data.accessToken);
        localStorage.setItem('user', JSON.stringify(data.user));
        // Navigate only if necessary
        if (data.user.role === 'admin' && !location.pathname.startsWith('/admin')) {
          navigate('/admin', { replace: true });
        } else if (data.user.role !== 'admin' && location.pathname.startsWith('/admin')) {
          navigate('/', { replace: true });
        }
      } catch (error) {
        console.error('Session restore failed:', error.message);
        await logout(false);
      } finally {
        setAuthLoading(false);
      }
    };

    initializeAuth();
    // Only set interval if token exists
    if (localStorage.getItem('accessToken')) {
      interval = setInterval(() => {
        if (localStorage.getItem('accessToken')) {
          initializeAuth();
        }
      }, 5 * 60 * 1000); // Refresh every 5 minutes
    }

    return () => {
      apiClient.interceptors.request.eject(requestInterceptor);
      apiClient.interceptors.response.eject(responseInterceptor);
      clearInterval(interval);
    };
  }, []); // Remove location.pathname dependency

  const login = (token, userData) => {
    setAccessToken(token);
    setUser(userData);
    localStorage.setItem('accessToken', token);
    localStorage.setItem('user', JSON.stringify(userData));
    setAuthLoading(false);
    if (userData.role === 'admin') {
      navigate('/admin', { replace: true });
    } else {
      navigate('/', { replace: true });
    }
  };

  const updateUser = (newUserData) => {
    setUser(newUserData);
    localStorage.setItem('user', JSON.stringify(newUserData));
  };

  const value = {
    user,
    accessToken,
    isAuthenticated: !!user,
    authLoading,
    login,
    logout,
    updateUser,
  };

  return (
    <AuthContext.Provider value={value}>
      {!authLoading && children}
    </AuthContext.Provider>
  );
};