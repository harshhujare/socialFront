import React, { createContext, useContext, useState, useEffect } from 'react';
import api from '../lib/api';

const AuthContext = createContext();

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    console.warn('useAuth must be used within an AuthProvider');
    return {
      user: null,
      IsLoggedIn: false,
      loading: true,
      login: () => Promise.resolve({ success: false, message: 'Not authenticated' }),
      register: () => Promise.resolve({ success: false, message: 'Not authenticated' }),
      handelLogout: () => {},
      updateUser: () => {}
    };
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [IsLoggedIn, setIsLoggedIn] = useState(false);
  const [loading, setLoading] = useState(true);


  // Check if user is logged in on app start
  useEffect(() => {
    const checkAuthStatus = async () => {
      try {
        const token = localStorage.getItem('token');
        if (token) {
          // Verify token with backend
          const response = await api.get('/auth/check');
          if (response.data.success) {
            setUser(response.data.user);
            setIsLoggedIn(true);
          } else {
            localStorage.removeItem('token');
          }
        }
      } catch (error) {
        console.error('Auth verification failed:', error);
        localStorage.removeItem('token');
      } finally {
        setLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (email, password) => {
    try {
         
      const response = await api.post('/user/Login', { email, password });
      if (response.data.success) {
        const { token, user } = response.data;
        console.log(token,"from context");
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsLoggedIn(true);
     
        return { success: true };
        
      } else {
        return { success: false, message: response.data.message || 'Login failed' };
      }
    } catch (error) {
      console.error('Login error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Login failed',
        error: error.response?.data || error.message
      };
    }
  };

  const register = async (userData) => {
    try {
      const response = await api.post('/user/signup', userData);
      if (response.data.success) {
        const { token, user } = response.data;
        localStorage.setItem('token', token);
        localStorage.setItem('user', JSON.stringify(user));
        setUser(user);
        setIsLoggedIn(true);
        return { success: true };
      } else {
        return { success: false, message: response.data.message };
      }
    } catch (error) {
      console.error('Registration error:', error);
      return { 
        success: false, 
        message: error.response?.data?.message || 'Registration failed' 
      };
    }
  };

  const handelLogout = async () => {
    try {
      await api.get('/user/logout');
    } catch (error) {
      console.error('Logout error:', error);
    } finally {
      localStorage.removeItem('token');
      localStorage.removeItem('user');
      setUser(null);
      setIsLoggedIn(false);
    }
  };

  const updateUser = (updatedUser) => {
    setUser(updatedUser);
  };

  const value = {
    user,
    IsLoggedIn,
    loading,
    login,
    register,
    handelLogout,
    updateUser
  };


  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
};

export default AuthContext;
