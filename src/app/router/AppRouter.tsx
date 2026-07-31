import { Routes, Route } from "react-router-dom";

import RootLayout from "../layouts/RootLayout";
import { routes } from "./routes";

export default function AppRouter() {
  return (
    <Routes>
      <Route element={<RootLayout />}>
        {routes.map((route) => (
          <Route
            key={route.path}
            path={route.path}
            element={route.element}
          />
        ))}
      </Route>
    </Routes>
  );
}