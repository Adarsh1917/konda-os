import {
  useEffect,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import {
  ThemeContext,
  type ThemeMode,
} from "./ThemeContext";

export function ThemeProvider({ children }: PropsWithChildren) {
  const [theme, setThemeState] = useState<ThemeMode>("dark");

  useEffect(() => {
    document.documentElement.setAttribute("data-theme", theme);
  }, [theme]);

  const setTheme = (value: ThemeMode) => {
    setThemeState(value);
  };

  const toggleTheme = () => {
    setThemeState((current) =>
      current === "dark" ? "light" : "dark"
    );
  };

  const value = useMemo(
    () => ({
      theme,
      setTheme,
      toggleTheme,
    }),
    [theme]
  );

  return (
    <ThemeContext.Provider value={value}>
      {children}
    </ThemeContext.Provider>
  );
}
