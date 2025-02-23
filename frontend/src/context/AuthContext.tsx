import { createContext, useState, useEffect, ReactNode } from "react";
import { getProfile, login, logout, register } from "../api/auth";

interface AuthContextType {
  user: any;
  login: (username: string, password: string) => Promise<void>;
  logout: () => void;
  register: (
    username: string,
    email: string,
    password: string
  ) => Promise<void>;
}

export const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider = ({ children }: { children: ReactNode }) => {
  const [user, setUser] = useState<any>(null);

  useEffect(() => {
    const fetchProfile = async () => {
      try {
        const response = await getProfile();
        setUser(response.data);
      } catch (error) {
        console.error("Not authenticated");
      }
    };
    fetchProfile();
  }, []);

  const handleLogin = async (username: string, password: string) => {
    await login(username, password);
    const response = await getProfile();
    setUser(response.data);
  };

  const handleLogout = async () => {
    await logout();
    setUser(null);
  };

  const handleRegister = async (
    username: string,
    email: string,
    password: string
  ) => {
    await register(username, email, password);
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        login: handleLogin,
        logout: handleLogout,
        register: handleRegister,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};
