/**
 * @file main.tsx
 * @summary Entry point for the TeamSync React application.
 * @remarks
 * - Wraps the app in React StrictMode for highlighting potential problems.
 * - Provides QueryProvider for React Query context.
 * - Provides AppProvider for centralized authentication state.
 * - Uses NuqsAdapter for URL query string management.
 * - Renders the main App component.
 * - Includes Toaster for global toast notifications.
 */
import { StrictMode } from "react";
import { createRoot } from "react-dom/client";
import { NuqsAdapter } from "nuqs/adapters/react";

import "./index.css";
import App from "./App.tsx";
import QueryProvider from "./context/query-provider.tsx";
import { AppProvider } from "./context/app-provider.tsx";
import { Toaster } from "./components/ui/toaster.tsx";

/**
 * Mounts the React application to the DOM element with id 'root'.
 *
 * @remarks
 * The application is wrapped with providers and adapters for state, query, and notifications.
 */
createRoot(document.getElementById("root")!).render(
  <StrictMode>
    <QueryProvider>
      <AppProvider>
        <NuqsAdapter>
          <App />
        </NuqsAdapter>
        <Toaster />
      </AppProvider>
    </QueryProvider>
  </StrictMode>
);
