import { User, Wallet } from "@prisma/client";
import React, {
  createContext,
  useCallback,
  useContext,
  useState,
  useEffect,
} from "react";

interface CompositeUser extends User {
  wallets: Wallet[];
}

interface UserContextData {
  user: CompositeUser | null;
  isLoading: boolean;
  error: string | null;
  fetchUser: () => void;
}

const UserContext = createContext<UserContextData>({
  user: null,
  isLoading: false,
  error: null,
  fetchUser: () => {},
});

const UserProvider: React.FC<React.PropsWithChildren<{}>> = ({ children }) => {
  const [user, setUser] = useState<CompositeUser | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  const fetchUser = useCallback(async () => {
    if (user) {
      setIsLoading(false);
      return; // User is already loaded and cached in-memory
    }
    setIsLoading(true);
    try {
      const res = await fetch("/api/user");
      if (res.ok) {
        const data: CompositeUser = await res.json();
        setUser(data);
        console.log("User data fetched:", data);
        setError(null);
      } else {
        //console.error("Failed to fetch user data");
      }
    } catch (error: unknown) {
      const message =
        error instanceof Error ? error.message : "Unknown error occurred";
      //console.error("Error fetching user:", message);
      setError(message);
    } finally {
      setIsLoading(false);
    }
  }, [user]);

  useEffect(() => {
    fetchUser();
  }, [fetchUser]);

  return (
    <UserContext.Provider
      value={{ user, isLoading, error, fetchUser }}
    >
      {children}
    </UserContext.Provider>
  );
};

function useUser(): UserContextData {
  const context = useContext(UserContext);

  if (!context) {
    throw new Error("useUser must be used within a UserProvider");
  }

  return context;
}

export { UserContext, UserProvider, useUser };
