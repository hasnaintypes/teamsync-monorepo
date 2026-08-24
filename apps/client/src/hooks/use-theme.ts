import { useCallback, useSyncExternalStore } from "react";

const STORAGE_KEY = "teamsync-theme";

function getSnapshot(): "light" | "dark" {
  return document.documentElement.classList.contains("dark") ? "dark" : "light";
}

function subscribe(callback: () => void): () => void {
  const observer = new MutationObserver(callback);
  observer.observe(document.documentElement, {
    attributes: true,
    attributeFilter: ["class"],
  });
  return () => observer.disconnect();
}

function applyTheme(theme: "light" | "dark") {
  if (theme === "dark") {
    document.documentElement.classList.add("dark");
  } else {
    document.documentElement.classList.remove("dark");
  }
  localStorage.setItem(STORAGE_KEY, theme);
}

// Initialize theme from localStorage or system preference on first load
const stored = localStorage.getItem(STORAGE_KEY) as "light" | "dark" | null;
if (stored) {
  applyTheme(stored);
} else if (window.matchMedia("(prefers-color-scheme: dark)").matches) {
  applyTheme("dark");
}

export default function useTheme() {
  const theme = useSyncExternalStore(subscribe, getSnapshot);

  const toggleTheme = useCallback(() => {
    applyTheme(theme === "dark" ? "light" : "dark");
  }, [theme]);

  return { theme, toggleTheme } as const;
}
