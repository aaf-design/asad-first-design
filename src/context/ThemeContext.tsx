"use client";

import React, { createContext, useContext, useEffect, useState } from "react";

type ThemeType = "indigo" | "emerald" | "rose" | "amber" | "cyan";

interface ThemeContextType {
  theme: ThemeType;
  setTheme: (theme: ThemeType) => void;
  isDarkMode: boolean;
  toggleDarkMode: () => void;
}

const ThemeContext = createContext<ThemeContextType | undefined>(undefined);

export function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [theme, setThemeState] = useState<ThemeType>("indigo");
  const [isDarkMode, setIsDarkMode] = useState(true);

  useEffect(() => {
    const savedTheme = localStorage.getItem("app-theme") as ThemeType;
    const savedMode = localStorage.getItem("app-mode");
    
    if (savedTheme) {
      setThemeState(savedTheme);
      document.documentElement.setAttribute("data-theme", savedTheme);
    }
    
    if (savedMode === "light") {
      setIsDarkMode(false);
      document.documentElement.setAttribute("data-mode", "light");
    } else {
      setIsDarkMode(true);
      document.documentElement.setAttribute("data-mode", "dark");
    }
  }, []);

  const setTheme = (newTheme: ThemeType) => {
    setThemeState(newTheme);
    localStorage.setItem("app-theme", newTheme);
    document.documentElement.setAttribute("data-theme", newTheme);
  };

  const toggleDarkMode = () => {
    const newMode = !isDarkMode;
    setIsDarkMode(newMode);
    const modeStr = newMode ? "dark" : "light";
    localStorage.setItem("app-mode", modeStr);
    document.documentElement.setAttribute("data-mode", modeStr);
  };

  return (
    <ThemeContext.Provider value={{ theme, setTheme, isDarkMode, toggleDarkMode }}>
      {children}
    </ThemeContext.Provider>
  );
}

export function useTheme() {
  const context = useContext(ThemeContext);
  if (context === undefined) {
    throw new Error("useTheme must be used within a ThemeProvider");
  }
  return context;
}
