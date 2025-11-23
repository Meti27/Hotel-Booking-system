import { createContext, useContext, useEffect, useState } from "react";

// Hardcoded demo users 
const USERS = [
  {
    id: 1,
    role: "ADMIN",
    email: "admin@hotel.com",
    password: "admin123",
    name: "Hotel Admin",
  },
  {
    id: 2,
    role: "USER",
    email: "john@doe.com",
    password: "user123",
    name: "John Doe",
  },
];

const AuthContext = createContext(null);

export function AuthProvider({ children }) {
  const [user, setUser] = useState(null);

  
  useEffect(() => {
    const stored = localStorage.getItem("hotel_user");
    if (stored) {
      try {
        setUser(JSON.parse(stored));
      } catch {
        localStorage.removeItem("hotel_user");
      }
    }
  }, []);

  function login(email, password) {
    const found = USERS.find(
      (u) => u.email === email && u.password === password
    );

    if (!found) {
      throw new Error("Invalid email or password.");
    }


    const { password: _pw, ...safeUser } = found;
    setUser(safeUser);
    localStorage.setItem("hotel_user", JSON.stringify(safeUser));
    return safeUser; 
  }

  function logout() {
    setUser(null);
    localStorage.removeItem("hotel_user");
  }

  const value = {
    user,
    isLoggedIn: !!user,
    isAdmin: user?.role === "ADMIN",
    login,
    logout,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
}

export function useAuth() {
  const ctx = useContext(AuthContext);
  if (!ctx) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return ctx;
}
