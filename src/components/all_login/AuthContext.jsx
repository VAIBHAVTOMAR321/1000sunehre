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

  // Store tokens in a ref so interceptors can access current values without re-creating the axios instance
  const tokensRef = useRef({ accessToken: null, refreshToken: null });

  const logout = useCallback(() => {
    isRefreshing = false;
    failedQueue = [];
    setUser(null);
    setAccessToken(null);
    setRefreshToken(null);
    setRole(null);
    setUniqueId(null);
    tokensRef.current = { accessToken: null, refreshToken: null };
    localStorage.removeItem(STORAGE_KEY);
  }, []);

  const login = useCallback((data) => {
    if (data.access && data.refresh) {
      setUser(data.user || null);
      setAccessToken(data.access);
      setRefreshToken(data.refresh);
      setRole(data.role || null);
      setUniqueId(data.unique_id || null);
      tokensRef.current = { accessToken: data.access, refreshToken: data.refresh };
    } else {
      console.error('Login failed: Access or Refresh token not found in response');
      logout();
    }
  }, [logout]);

  const refreshAccessToken = useCallback(async () => {
    const currentRefresh = tokensRef.current.refreshToken;
    if (!currentRefresh || isRefreshing) {
      if (!currentRefresh) logout();
      return null;
    }

    isRefreshing = true;
    try {
      const response = await axios.post(`${API_URL}/refresh-token/`, {
        refresh: currentRefresh,
      });
      const { access } = response.data;
      tokensRef.current.accessToken = access;
      setAccessToken(access);
      processQueue(null, access);
      return access;
    } catch (error) {
      const errorData = error.response?.data;
      if (errorData?.error === "Invalid or expired refresh token") {
        console.error("Auth Session Expired:", errorData.error);
      }
      processQueue(error, null);
      logout();
      return null;
    } finally {
      isRefreshing = false;
    }
  }, [logout]);

  // Restore auth state from localStorage on mount
  useEffect(() => {
    const savedAuth = localStorage.getItem(STORAGE_KEY);
    if (savedAuth) {
      try {
        const parsed = JSON.parse(savedAuth);
        if (parsed.access && parsed.refresh) {
          setUser(parsed.user || null);
          setAccessToken(parsed.access);
          setRefreshToken(parsed.refresh);
          setRole(parsed.role || null);
          setUniqueId(parsed.unique_id || null);
          tokensRef.current = { accessToken: parsed.access, refreshToken: parsed.refresh };
          
          // Proactively refresh tokens immediately on page load/refresh
          refreshAccessToken();
        } else {
          logout();
        }
      } catch (err) {
        console.error('Failed to parse auth data:', err);
        logout();
      }
    }
    setIsReady(true);
  }, [logout, refreshAccessToken]);

  // Keep tokensRef in sync with state for the axios interceptors
  useEffect(() => {
    tokensRef.current = { accessToken, refreshToken };
  }, [accessToken, refreshToken]);

  // Persist auth state to localStorage on changes
  useEffect(() => {
    if (accessToken && refreshToken) {
      const authData = {
        user,
        access: accessToken,
        refresh: refreshToken,
        role,
        unique_id: uniqueId,
      };
      localStorage.setItem(STORAGE_KEY, JSON.stringify(authData));
    } else if (isReady && (!accessToken || !refreshToken)) {
      // If we are ready but tokens are missing, ensure storage is clean
      localStorage.removeItem(STORAGE_KEY);
    }
  }, [user, accessToken, refreshToken, role, uniqueId, isReady]);

  // Set up proactive refresh every 30 seconds
  useEffect(() => {
    let interval = null;
    if (accessToken && refreshToken) {
      interval = setInterval(() => {
        refreshAccessToken();
      }, 30000); // 30 seconds for testing/short access tokens
    }
    return () => {
      if (interval) clearInterval(interval);
    };
  }, [accessToken, refreshToken, refreshAccessToken]);

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

          // Reuse the centralized refresh logic
          const access = await refreshAccessToken();
          if (access) {
            originalRequest.headers.Authorization = `Bearer ${access}`;
            return instance(originalRequest);
          }
          return Promise.reject(error);
        }
        return Promise.reject(error);
      }
    );

    return instance;
  }, [logout, refreshAccessToken]);

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