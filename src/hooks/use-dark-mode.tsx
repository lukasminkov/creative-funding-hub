
import { useEffect, useState } from "react";

export function useDarkMode() {
  const [isDarkMode, setIsDarkMode] = useState(() => {
    // Check if user has previously set a preference
    const savedPreference = localStorage.getItem("darkMode");
    if (savedPreference !== null) {
      return savedPreference === "true";
    }
    // If no saved preference, check system preference
    return window.matchMedia("(prefers-color-scheme: dark)").matches;
  });

  useEffect(() => {
    const root = window.document.documentElement;

    if (isDarkMode) {
      root.classList.add("dark");
    } else {
      root.classList.remove("dark");
    }
    
    // Save the preference to localStorage
    localStorage.setItem("darkMode", isDarkMode.toString());
  }, [isDarkMode]);
  
  const toggleDarkMode = () => {
    setIsDarkMode(prev => !prev);
  };

  // Subscribe to system preference changes
  useEffect(() => {
    const mediaQuery = window.matchMedia("(prefers-color-scheme: dark)");
    const handleChange = (e: MediaQueryListEvent) => {
      // Only update if the user hasn't explicitly set a preference
      if (!localStorage.getItem("darkMode")) {
        setIsDarkMode(e.matches);
      }
    };

    mediaQuery.addEventListener("change", handleChange);
    return () => mediaQuery.removeEventListener("change", handleChange);
  }, []);

  return {
    isDarkMode,
    toggleDarkMode,
  };
}
