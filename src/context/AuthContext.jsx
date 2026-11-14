import { createContext, useContext, useState, useEffect } from 'react';
import { api } from '../api';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const token = localStorage.getItem('ff_token');
    
    // টোকেন না থাকলে সরাসরি লোডিং শেষ করে দেবে
    if (!token) {
      setLoading(false);
      return;
    }

    // টোকেন থাকলে ইউজারের ডাটা চেক করবে
    api.me()
      .then(u => {
        setUser(u);
        setLoading(false);
      })
      .catch(() => {
        setLoading(false);
      });
  }, []);

  const login = async (email, password) => {
    const res = await api.login(email, password);
    
    // টোকেন সেভ করা
    if (res.token) {
      localStorage.setItem('ff_token', res.token);
    }
    
    setUser(res.user);
    return res.user;
  };

  const logout = () => { 
    api.logout(); 
    setUser(null); 
    // চাইলে এখানে navigate('/login') দিতে পারেন
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export const useAuth = () => useContext(AuthContext);