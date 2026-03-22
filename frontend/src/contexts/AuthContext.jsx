import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { authApi } from '../api/authApi';
import { authStorage } from '../storage';

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(authStorage.getUser());
  const [isLoading, setIsLoading] = useState(Boolean(authStorage.getAccessToken()));

  useEffect(() => {
    const initialize = async () => {
      if (!authStorage.getAccessToken()) {
        setIsLoading(false);
        return;
      }

      try {
        const response = await authApi.me();
        setUser(response.data);
        localStorage.setItem('ojss_user', JSON.stringify(response.data));
      } catch (_error) {
        authStorage.clear();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    initialize();
  }, []);

  const value = useMemo(
    () => ({
      user,
      isAuthenticated: Boolean(user),
      isLoading,
      async login(credentials) {
        const response = await authApi.login(credentials);
        authStorage.setSession(response.data);
        setUser(response.data.user);
        return response;
      },
      async logout() {
        try {
          await authApi.logout(authStorage.getRefreshToken());
        } catch (_error) {
          // ignore logout failures
        }
        authStorage.clear();
        setUser(null);
      },
      setSession(session) {
        authStorage.setSession(session);
        setUser(session.user);
      },
    }),
    [user, isLoading],
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export const useAuth = () => useContext(AuthContext);
