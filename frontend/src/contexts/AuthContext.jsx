import { createContext, useContext, useState, useEffect } from 'react';
import api from '../config/axios';

const AuthContext = createContext(null);

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth debe usarse dentro de AuthProvider');
  }
  return context;
};

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      setUser({ token });
    }
    setLoading(false);
  }, []);

  const login = async (email, password) => {
    try {
      const response = await api.post('/auth/login', { email, password });
      const { token } = response.data;
      localStorage.setItem('token', token);
      setUser({ token });
      return { success: true };
    } catch (error) {
      console.error('Error en login:', error);
      let errorMessage = 'Error al iniciar sesión';
      
      if (error.response) {
        // El servidor respondió con un error
        if (error.response.status === 401) {
          errorMessage = 'Credenciales inválidas. Verifica tu email y contraseña.';
        } else {
          errorMessage = error.response.data?.message || `Error ${error.response.status}`;
        }
      } else if (error.request) {
        // La petición se hizo pero no hubo respuesta
        errorMessage = 'No se pudo conectar con el servidor. Verifica que el backend esté corriendo en el puerto 4000.';
      } else {
        // Algo más pasó
        errorMessage = error.message || 'Error desconocido';
      }
      
      return {
        success: false,
        message: errorMessage,
      };
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setUser(null);
  };

  const isAuthenticated = !!user;

  return (
    <AuthContext.Provider value={{ user, login, logout, isAuthenticated, loading }}>
      {children}
    </AuthContext.Provider>
  );
};

