import { createContext, useCallback, useContext, useEffect, useState } from "react";
import jwt_decode from "jwt-decode";
import { useRouter } from "next/navigation";

export interface AuthUser {
  sub: number;
  firstName: string;
  lastName: string;
  email: string;
  role: string;
  picture: string;
}

interface DecodedAuthUser extends AuthUser {
  exp: number;
}

type AuthContextInfo = {
  getUser: () => AuthUser | undefined;
  login: (token: string) => void;
  logout: () => void;
};

const AuthContext = createContext<AuthContextInfo | undefined>(undefined);

export const AuthProvider = ({ children }: { children: React.ReactNode }) => {
  const [user, setUser] = useState<DecodedAuthUser | null>(null);
  const router = useRouter();

  function decodeToken(token: string): DecodedAuthUser | undefined {
    if (token) {
      const decoded: DecodedAuthUser = jwt_decode(token);
      if (Date.now() < decoded.exp * 1000) {
        return decoded;
      }
    }
  }

  function getUser(): AuthUser | undefined {
    if (user && Date.now() < user.exp * 1000) {
      return user;
    }
  }

  const login = useCallback(
    (token: string, url?: string) => {
      const decoded = decodeToken(token);
      if (decoded) {
        setUser(decoded);
        localStorage.setItem("token", token);
        url && router.replace(url);
        return decoded;
      }
    },
    [setUser, router]
  );

  function logout() {
    setUser(null);
    localStorage.removeItem("token");
  }

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      const user = login(token);
      if (!user) {
        localStorage.removeItem("token");
      }
    }
  }, [login]);

  return (
    <AuthContext.Provider
      value={{
        getUser,
        login: (token: string) => {
          login(token, "/");
        },
        logout: logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth(): [AuthUser | undefined, (token: string) => void, () => void] {
  const context = useContext(AuthContext);

  if (context === undefined) {
    throw new Error("useAuth must be used within a AuthProvider");
  }
  return [context.getUser(), context.login, context.logout];
}

export function isAdmin(user: AuthUser | null) {
  return user?.role === "ADMIN";
}
