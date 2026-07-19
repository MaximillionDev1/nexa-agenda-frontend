import { createContext, useContext, useEffect, useState } from "react";
import type { IAdmin, ILoginRequest, ILoginResponse } from "@/types";
import { apiService } from "@/services/api";

interface IAuthContext {
  admin: IAdmin | null;
  token: string | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (data: ILoginRequest) => Promise<void>;
  logout: () => void;
}

const AuthContext = createContext<IAuthContext | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [admin, setAdmin] = useState<IAdmin | null>(null);
  const [token, setToken] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(true);

  // Carregar token do localStorage ao iniciar
  useEffect(() => {
    const storedToken = localStorage.getItem("token");
    if (storedToken) {
      setToken(storedToken);
      // Validar token
      validateToken(storedToken);
    } else {
      setIsLoading(false);
    }
  }, []);

  async function validateToken(authToken: string) {
    try {
      const response = await apiService.getMe();
      if (response.success && response.data) {
        setAdmin(response.data as IAdmin);
        setToken(authToken);
      } else {
        logout();
      }
    } catch (_error) {
      logout();
    } finally {
      setIsLoading(false);
    }
  }

  async function login(data: ILoginRequest) {
    const response: ILoginResponse = await apiService.login(data);
    setAdmin(response.admin);
    setToken(response.token);
    localStorage.setItem("token", response.token);
  }

  function logout() {
    setAdmin(null);
    setToken(null);
    localStorage.removeItem("token");
  }

  const value: IAuthContext = {
    admin,
    token,
    isLoading,
    isAuthenticated: !!admin && !!token,
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error("useAuth must be used within AuthProvider");
  }
  return context;
}
