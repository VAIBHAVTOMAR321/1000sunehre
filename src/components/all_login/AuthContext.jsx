import React, { createContext, useContext, useState, useMemo, useEffect, useCallback, useRef } from 'react';
import axios from 'axios';

const AuthContext = createContext(null);

const STORAGE_KEY = 'gyandhara_auth';
const API_URL = 'https://mahadevaaya.com/golden100days/golden100days_backend/api';

let isRefreshing = false;
let failedQueue = [];

const processQueue = (error, token = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token);
    }
  });
  failedQueue = [];
};

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);
  const [accessToken, setAccessToken] = useState(null);
  const [refreshToken, setRefreshToken] = useState(null);
  const [role, setRole] = useState(null);
  const [uniqueId, setUniqueId] = useState(null);
  const [isReady, setIsReady] = useState(false);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        setUser(parsed.user || null);
        setAccessToken(parsed.access || null);
        setRefreshToken(parsed.refresh || null);
        setRole(parsed.role || null);
        setUniqueId(parsed.unique_id || null);
        tokensRef.current = { accessToken: parsed.access, refreshToken: parsed.refresh };
      } catch (err) {
        console.error('Failed to parse auth data:', err);
        localStorage.removeItem(STORAGE_KEY);
      }
    }
    setIsReady(true);
  }, []);

  // Persist auth state to localStorage on changes
  useEffect(() => {
    if (accessToken) {
      const authData = {
        user,
        access: accessToken,
        refresh: refreshToken,
        role,
        unique_id: uniqueId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } else {
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, accessToken, refreshToken, role, uniqueId]);

  const login = useCallback((data) => {
    setUser(data.user);
    setAccessToken(data.access);
    setRefreshToken(data.refresh);
    setRole(data.role);
    setUniqueId(data.unique_id);
    tokensRef.current = { accessToken: data.access, refreshToken: data.refresh };
  }, []);

  const logout = useCallback(() => {
    isRefreshing = false;
    failedQueue = [];
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setUniqueId(null);
    tokensRef.current = { accessToken: null, refreshToken: null };
    localStorage.clear();
  }, []);

  // Store tokens in a ref so interceptors can access current values without re-creating the axios instance
  const tokensRef = useRef({ accessToken, refreshToken });
  useEffect(() => {
    tokensRef.current = { accessToken, refreshToken };
  }, [accessToken, refreshToken]);

  // Authenticated axios instance with automatic token refresh logic
  const api = useMemo(() => {
    const instance = axios.create({
      baseURL: API_URL,
      headers: { 'Content-Type': 'application/json' },
    });

    instance.interceptors.request.use(
      (config) => {
        const token = tokensRef.current.accessToken;
        if (token) {
          config.headers.Authorization = `Bearer ${token}`;
        }
        return config;
      },
      (error) => Promise.reject(error)
    );

    instance.interceptors.response.use(
      (response) => response,
      async (error) => {
        const originalRequest = error.config;
        const refresh = tokensRef.current.refreshToken;

        if (error.response?.status === 401) {
          // If we already tried to refresh and failed, or if no refresh token is available, log out immediately
          if (originalRequest._retry || !refresh) {
            logout();
            return Promise.reject(error);
          }

          if (isRefreshing) {
            return new Promise((resolve, reject) => {
              failedQueue.push({ resolve, reject });
            }).then(token => {
              originalRequest.headers.Authorization = `Bearer ${token}`;
              return instance(originalRequest);
            }).catch(err => Promise.reject(err));
          }

          originalRequest._retry = true;
          isRefreshing = true;

          try {
            const response = await axios.post(`${API_URL}/refresh-token/`, { //
              refresh: refresh,
            });

            const { access } = response.data;
            tokensRef.current.accessToken = access; // Sync ref immediately before retry
            setAccessToken(access); // Updates context state and localStorage
            processQueue(null, access);

            originalRequest.headers.Authorization = `Bearer ${access}`;
            return instance(originalRequest);
          } catch (refreshError) {
            processQueue(refreshError, null);
            logout();
            return Promise.reject(refreshError);
          } finally {
            isRefreshing = false;
          }
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [logout]);

  const refreshAccessToken = useCallback(async () => {
    if (!refreshToken) {
      logout();
      return null;
    }
    try {
      const response = await axios.post(`${API_URL}/refresh-token/`, { //
        refresh: refreshToken,
      });
      const { access } = response.data;
      tokensRef.current.accessToken = access; // Sync ref immediately
      setAccessToken(access);
      return access;
    } catch (error) {
      logout();
      return null;
    }
  }, [refreshToken, logout]);

  const value = useMemo(() => ({
    user,
    accessToken,
    refreshToken,
    role,
    uniqueId,
    login,
    logout,
    api,
    refreshAccessToken,
    isAuthenticated: !!accessToken,
    isReady,
  }), [user, accessToken, refreshToken, role, uniqueId, api, refreshAccessToken, isReady]);

  return (
    <AuthContext.Provider value={value}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}