import { useContext } from "react";

import { NavigationContext } from "./NavigationContextValue";

export function useNavigation() {
  const context = useContext(NavigationContext);

  if (!context) {
    throw new Error(
      "useNavigation must be used inside NavigationProvider"
    );
  }

  return context;
}
