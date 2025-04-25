import { createContext, useContext, useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import apiClient from '../api/client';

const AuthContext = createContext();

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const navigate = useNavigate();

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      apiClient.get('/auth/me')
        .then(({ data }) => setUser(data))
        .catch(() => logout());
    }
  }, []);

  const login = async (email, password) => {
    try {
      const { data } = await apiClient.post('http://localhost:5000/api/auth/login', { email, password });
      localStorage.setItem('token', data.token);
      setUser(data.user);
      //testing use, comment out for final
      console.log('Token: ', data.token);
      console.log('User Data: ', data.user);

      return true;
    } catch (error) {
      console.log("Fail: ", error);
      return false;
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  return useContext(AuthContext);
}