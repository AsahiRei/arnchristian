"use client";

import { createContext, useContext, useState, useEffect } from "react";

const ThemeContext = createContext<{
  dark: boolean;
  setDark: (v: boolean) => void;
}>({ dark: true, setDark: () => {} });

export function useTheme() {
  return useContext(ThemeContext);
}

export default function ThemeProvider({ children }: { children: React.ReactNode }) {
  const [dark, setDark] = useState(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", dark);
  }, [dark]);

  return (
    <ThemeContext.Provider value={{ dark, setDark }}>
      {children}
    </ThemeContext.Provider>
  );
}
