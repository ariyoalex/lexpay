import { createContext, type ReactNode, useCallback, useContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

import { setOnRefreshFailed, setRefreshHandler } from "@/services/api";
import { loginApi, logoutApi, refreshTokenApi, registerApi, type UserResponse } from "@/services/authApi";

interface AuthState {
  user: UserResponse | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;
  isLoading: boolean;
}

interface AuthContextType extends AuthState {
  login: (email: string, password: string) => Promise<void>;
  register: (data: {
    firstName: string;
    lastName: string;
    email: string;
    phone: string;
    password: string;
  }) => Promise<string>;
  logout: () => Promise<void>;
  refreshAuth: () => Promise<string | null>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

function loadTokens(): { accessToken?: string; refreshToken?: string } {
  try {
    const accessToken = localStorage.getItem("accessToken") ?? undefined;
    const refreshToken = localStorage.getItem("refreshToken") ?? undefined;
    return { accessToken, refreshToken };
  } catch {
    return {};
  }
}

function saveTokens(accessToken: string, refreshToken: string) {
  localStorage.setItem("accessToken", accessToken);
  localStorage.setItem("refreshToken", refreshToken);
}

function clearTokens() {
  localStorage.removeItem("accessToken");
  localStorage.removeItem("refreshToken");
}

function loadUser(): UserResponse | null {
  try {
    const raw = localStorage.getItem("user");
    return raw ? JSON.parse(raw) : null;
  } catch {
    return null;
  }
}

function saveUser(user: UserResponse) {
  localStorage.setItem("user", JSON.stringify(user));
}

function clearUser() {
  localStorage.removeItem("user");
}

export function AuthProvider({ children }: { children: ReactNode }) {
  const navigate = useNavigate();
  const [state, setState] = useState<AuthState>(() => {
    const tokens = loadTokens();
    const user = loadUser();
    return {
      user,
      accessToken: tokens.accessToken || null,
      refreshToken: tokens.refreshToken || null,
      isAuthenticated: !!tokens.accessToken && !!user,
      isLoading: false,
    };
  });

  const refreshAuth = useCallback(async (): Promise<string | null> => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (!storedRefresh) return null;

    try {
      const result = await refreshTokenApi(storedRefresh);
      saveTokens(result.accessToken, result.refreshToken);
      setState((prev) => ({
        ...prev,
        accessToken: result.accessToken,
        refreshToken: result.refreshToken,
      }));
      return result.accessToken;
    } catch {
      clearTokens();
      clearUser();
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      return null;
    }
  }, []);

  useEffect(() => {
    setRefreshHandler(refreshAuth);
    setOnRefreshFailed(() => {
      clearTokens();
      clearUser();
      setState({
        user: null,
        accessToken: null,
        refreshToken: null,
        isAuthenticated: false,
        isLoading: false,
      });
      navigate("/auth/sign-in");
    });
  }, [refreshAuth, navigate]);

  const login = useCallback(async (email: string, password: string) => {
    const result = await loginApi({ email, password });
    saveTokens(result.accessToken, result.refreshToken);
    saveUser(result.user);
    setState({
      user: result.user,
      accessToken: result.accessToken,
      refreshToken: result.refreshToken,
      isAuthenticated: true,
      isLoading: false,
    });
  }, []);

  const registerFn = useCallback(
    async (data: {
      firstName: string;
      lastName: string;
      email: string;
      phone: string;
      password: string;
    }): Promise<string> => {
      const result = await registerApi(data);
      return result.userId;
    },
    [],
  );

  const logout = useCallback(async () => {
    const storedRefresh = localStorage.getItem("refreshToken");
    if (storedRefresh) {
      try {
        await logoutApi(storedRefresh);
      } catch {
        // ignore
      }
    }
    clearTokens();
    clearUser();
    setState({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,
      isLoading: false,
    });
  }, []);

  return (
    <AuthContext.Provider
      value={{
        ...state,
        login,
        register: registerFn,
        logout,
        refreshAuth,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth(): AuthContextType {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
