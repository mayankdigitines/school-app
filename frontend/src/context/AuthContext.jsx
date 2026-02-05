import { createContext, useContext, useState, useEffect } from 'react';
import api from '../services/api';
import { useNavigate } from 'react-router-dom';

const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(JSON.parse(localStorage.getItem('user')) || null);
  const [token, setToken] = useState(localStorage.getItem('token') || null);
  const [loading, setLoading] = useState(false);
  
  // Note: We need a way to navigate, but Router isn't available inside AuthProvider unless AuthProvider is inside Router.
  // We'll trust that the consumer handles navigation or we might need to restructure.
  // Actually, we can't use useNavigate here easily if this wraps App.
  // For now, simple state management.
  
  const login = async (username, password, role) => {
    setLoading(true);
    try {
      const response = await api.post('/auth/login', { username, password, role });
      const { token, data } = response.data;
      
      const userData = data.user; 
      const authToken = token;

      setUser(userData);
      setToken(authToken);
      localStorage.setItem('user', JSON.stringify(userData));
      localStorage.setItem('token', authToken);
      setLoading(false);
      return userData;
    } catch (error) {
      setLoading(false);
      throw error;
    }
  };

  const logout = () => {
    setUser(null);
    setToken(null);
    localStorage.removeItem('user');
    localStorage.removeItem('token');
    window.location.href = '/login';
  };

  return (
    <AuthContext.Provider value={{ user, token, login, logout, loading }}>
        {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => useContext(AuthContext);
