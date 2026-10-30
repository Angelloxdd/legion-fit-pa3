import { useState } from "react";
import type { ReactNode } from "react";
import { api } from "../services/api";
import { AuthContext } from "./auth-context";
import type { User } from "../types";


interface AuthProviderProps {
  children: ReactNode;
}

export function AuthProvider({ children }: AuthProviderProps) {
  const [user, setUser] = useState<User | null>(null);
  const [token, setToken] = useState<string | null>(null);

  async function login(email: string, password: string): Promise<void> {
    const result = await api.login(email, password);

    if (!result.token || !result.user) {
      throw new Error("La respuesta del servidor no incluye la sesión.");
    }

    setToken(result.token);
    setUser(result.user);
  }

  async function register(
    name: string,
    email: string,
    password: string,
  ): Promise<void> {
    await api.register(name, email, password);
  }

  function logout(): void {
    setToken(null);
    setUser(null);
  }

  return (
    <AuthContext.Provider value={{ user, token, login, register, logout }}>
      {children}
    </AuthContext.Provider>
  );
}