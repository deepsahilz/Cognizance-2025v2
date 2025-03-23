import { createContext, useState, useContext, useEffect } from 'react';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [token, setToken] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    // Check if user is already logged in from localStorage
    const storedToken = localStorage.getItem('token');
    if (storedToken) {
      setToken(storedToken);
      setIsLoggedIn(true);
    }
    setLoading(false);
  }, []);


  const signup = async (userData) => {
    try {
      setLoading(true);
      // In a real app, you would make an API call here
      // const response = await api.post('/auth/signup', userData);
      // const { token } = response.data;
      
      // For demo purposes:
      const token = 'demo-token-12345';
      
      localStorage.setItem('token', token);
      setToken(token);
      setIsLoggedIn(true);
      return { success: true };
    } catch (error) {
      return { 
        success: false, 
        error: error.message || 'Signup failed' 
      };
    } finally {
      setLoading(false);
    }
  };

  const logout = () => {
    localStorage.removeItem('token');
    setToken(null);
    setIsLoggedIn(false);
  };

  const checkAuth = () => {
    return Boolean(localStorage.getItem('token'));
  };

  const value = {
    isLoggedIn,
    setIsLoggedIn,
    token,
    signup,
    logout,
    loading,
    setToken,
    checkAuth
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};

export default AuthContext;