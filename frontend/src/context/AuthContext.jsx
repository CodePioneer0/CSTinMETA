import { createContext, useContext, useState, useEffect } from 'react';
import { startSession as apiStartSession } from '../api/auth';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [token, setToken] = useState(localStorage.getItem('token'));
  const [anonymousId, setAnonymousId] = useState(localStorage.getItem('anonymousId'));
  const [onboarded, setOnboarded] = useState(localStorage.getItem('onboarded') === 'true');
  const [loading, setLoading] = useState(false);

  const saveAuth = (tok, anonId) => {
    localStorage.setItem('token', tok);
    localStorage.setItem('anonymousId', anonId);
    setToken(tok);
    setAnonymousId(anonId);
  };

  const markOnboarded = () => {
    localStorage.setItem('onboarded', 'true');
    setOnboarded(true);
  };

  const startSession = async () => {
    setLoading(true);
    try {
      const res = await apiStartSession();
      saveAuth(res.data.token, res.data.anonymousId);
      return res.data;
    } finally {
      setLoading(false);
    }
  };

  const loginWithToken = (tok, anonId) => {
    saveAuth(tok, anonId);
    setOnboarded(true); // logged-in users are onboarded
  };

  const logout = () => {
    localStorage.removeItem('token');
    localStorage.removeItem('anonymousId');
    localStorage.removeItem('onboarded');
    setToken(null);
    setAnonymousId(null);
    setOnboarded(false);
  };

  const isAuthenticated = !!token;

  return (
    <AuthContext.Provider
      value={{
        token,
        anonymousId,
        onboarded,
        loading,
        isAuthenticated,
        startSession,
        loginWithToken,
        markOnboarded,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
}
