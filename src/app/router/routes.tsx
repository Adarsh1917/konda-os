import type { ReactElement } from "react";

import { AppShell } from "../../components/top-bar";

interface AppRoute {
  path: string;
  element: ReactElement;
}

export const routes: AppRoute[] = [
  {
    path: "/",
    element: <AppShell />,
  },
];