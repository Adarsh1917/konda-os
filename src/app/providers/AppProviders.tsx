import type { PropsWithChildren } from "react";

import { ThemeProvider } from "./ThemeProvider";
import { NavigationProvider } from "../navigation";

export default function AppProviders({
  children,
}: PropsWithChildren) {
  return (
    <ThemeProvider>
      <NavigationProvider>
        {children}
      </NavigationProvider>
    </ThemeProvider>
  );
}