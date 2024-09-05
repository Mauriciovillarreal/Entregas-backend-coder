import React, { createContext, useState, useEffect } from 'react';

export const AuthContext = createContext();

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);  // Estado de carga

  useEffect(() => {
    const fetchCurrentUser = async () => {
      try {
        const response = await fetch('http://localhost:8080/api/sessions/current', {
          credentials: 'include',
          headers: {
            'Content-Type': 'application/json',
          },
        });
        if (response.ok) {
          const data = await response.json();
          setUser(data.user);
        } else {
          console.error('Failed to fetch current user');
        }
      } catch (error) {
        console.error('Error fetching current user:', error);
      } finally {
        setLoading(false);  // Establecer carga a false
      }
    };

    fetchCurrentUser();
  }, []);

  const handleGitHubLogin = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/current', { 
        credentials: 'include'
      });
      if (!response.ok) {
        throw new Error('Network response was not ok');
      }
      const data = await response.json();
      console.log('User data fetched:', data.user);
      setUser(data.user);
    } catch (error) {
      console.error('Error fetching current user:', error);
    }
  };

  const register = async (formData) => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/register', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(formData),
        credentials: 'include',
      });

      const data = await response.json();

      if (response.ok) {
        console.log('User registered:', data.user);
        setUser(data.user);
        window.location.href = '/';
      } else {
        console.error('Error registering user:', data.error);
      }
    } catch (error) {
      console.error('Error registering user:', error);
    }
  };

  const login = (userData) => {
    console.log('User logged in:', userData);
    setUser(userData);
  };

  const logout = async () => {
    try {
      const response = await fetch('http://localhost:8080/api/sessions/logout', {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' },
        credentials: 'include',
      });

      if (response.ok) {
        console.log('User logged out');
        setUser(null);
        window.location.href = '/login';
      } else {
        const errorData = await response.json();
        throw new Error(errorData.error || 'Error al cerrar sesión');
      }
    } catch (error) {
      console.error('Error al cerrar sesión:', error.message);
      throw error;
    }
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, handleGitHubLogin }}>
      {children}
    </AuthContext.Provider>
  );
};
