import {
  useContext,
  useMemo,
  useState,
  type PropsWithChildren,
} from "react";

import type { NavigationItem } from "./types";
import { NavigationContext } from "./NavigationContextValue";

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

// eslint-disable-next-line react-refresh/only-export-components
export function useNavigationContext() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigationContext must be used inside NavigationProvider"
    );
  }

  return context;
}
