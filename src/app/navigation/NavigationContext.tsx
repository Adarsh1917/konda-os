import {
  createContext,
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type {
  NavigationContextValue,
  NavigationItem,
} from "./types";

const NavigationContext =
  createContext<NavigationContextValue | null>(null);

export function NavigationProvider({
  children,
}: PropsWithChildren) {
  const [activeItem, setActiveItem] =
    useState<NavigationItem>("explorer");

  const value = useMemo(
    () => ({
      activeItem,
      setActiveItem,
    }),
    [activeItem]
  );

  return (
    <NavigationContext.Provider value={value}>
      {children}
    </NavigationContext.Provider>
  );
}

export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigationContext must be used inside NavigationProvider"
    );
  }

  return context;
}