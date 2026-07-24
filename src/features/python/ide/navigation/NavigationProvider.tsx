import type { ReactNode } from "react";

import { NavigationContextProvider } from "./NavigationContext";

interface NavigationProviderProps {
  children: ReactNode;
}

export default function NavigationProvider({
  children,
}: NavigationProviderProps) {
  return (
    <NavigationContextProvider>
      {children}
    </NavigationContextProvider>
  );
}