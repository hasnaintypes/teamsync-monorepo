/**
 * @file app-provider.tsx
 * @summary Centralized app provider that manages authentication and provides global context.
 * @remarks
 * This provider centralizes authentication logic to prevent multiple API calls across routes.
 */
import { createContext, useContext, useEffect } from "react";
import useAuth from "@/hooks/api/use-auth";
import { UserType } from "@/types/api.type";

// Define the context shape
type AppContextType = {
  user?: UserType;
  error: unknown;
  isLoading: boolean;
  isFetching: boolean;
  refetchAuth: () => void;
  isAuthenticated: boolean;
};

const AppContext = createContext<AppContextType | undefined>(undefined);

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({
  children,
}) => {
  const {
    data: authData,
    error: authError,
    isLoading,
    isFetching,
    refetch: refetchAuth,
  } = useAuth();
  
  const user = authData?.user;
  const isAuthenticated = !!user;

  // Handle global authentication errors
  useEffect(() => {
    if (authError && authError.status === 401) {
      // Clear any stale authentication state on 401
      localStorage.removeItem('auth-state');
    }
  }, [authError]);

  return (
    <AppContext.Provider
      value={{
        user,
        error: authError,
        isLoading,
        isFetching,
        refetchAuth,
        isAuthenticated,
      }}
    >
      {children}
    </AppContext.Provider>
  );
};

// eslint-disable-next-line react-refresh/only-export-components
export const useAppContext = () => {
  const context = useContext(AppContext);
  if (!context) {
    throw new Error("useAppContext must be used within an AppProvider");
  }
  return context;
};
