import { createContext, useContext, useEffect, useState } from "react";

const AuthContext = createContext();

// =====================================
// NORMALIZE USER
// =====================================
function normalizeUser(userData) {
  if (!userData) {
    return null;
  }

  return {
    ...userData,
    role: userData.role
      ? String(userData.role).toLowerCase()
      : "",
  };
}

// =====================================
// AUTH PROVIDER
// =====================================
export function AuthProvider({ children }) {
  const [user, setUser] = useState(() => {
    const saved = localStorage.getItem("user");

    if (!saved) {
      return null;
    }

    try {
      const parsedUser = JSON.parse(saved);
      const normalizedUser = normalizeUser(parsedUser);

      // Update old saved account data
      localStorage.setItem(
        "user",
        JSON.stringify(normalizedUser)
      );

      return normalizedUser;
    } catch (error) {
      console.error("Failed to read saved user:", error);

      localStorage.removeItem("user");
      localStorage.removeItem("token");

      return null;
    }
  });

  const [sessionChecked, setSessionChecked] = useState(false);

  // =====================================
  // VALIDATE SAVED SESSION
  // =====================================
  useEffect(() => {
    const token = localStorage.getItem("token");

    if (!token) {
      setSessionChecked(true);
      return;
    }

    fetch("/api/auth/me", {
      method: "GET",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    })
      .then(async (response) => {
        if (!response.ok) {
          throw new Error(`Session validation failed: ${response.status}`);
        }

        return response.json();
      })
      .then((data) => {
        if (data?.user) {
          const normalizedUser = normalizeUser({
            ...data.user,
            full_name: data.user.name,
          });

          localStorage.setItem(
            "user",
            JSON.stringify(normalizedUser)
          );

          setUser(normalizedUser);
        }
      })
      .catch((error) => {
        console.warn("Stored session is no longer valid:", error);

        localStorage.removeItem("token");
        localStorage.removeItem("user");
        setUser(null);
      })
      .finally(() => {
        setSessionChecked(true);
      });
  }, []);

  // =====================================
  // LOGIN
  // =====================================
  function login(userData, token) {
    const normalizedUser = normalizeUser(userData);

    localStorage.setItem(
      "user",
      JSON.stringify(normalizedUser)
    );

    localStorage.setItem("token", token);

    setUser(normalizedUser);
  }

  // =====================================
  // LOGOUT
  // =====================================
  function logout() {
    localStorage.removeItem("user");
    localStorage.removeItem("token");

    setUser(null);
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        logout,
        sessionChecked,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

// =====================================
// USE AUTH
// =====================================
export function useAuth() {
  return useContext(AuthContext);
}