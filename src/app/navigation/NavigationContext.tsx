import {
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

