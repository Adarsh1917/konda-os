import { Outlet } from "react-router-dom";

export default function RootLayout() {
  return (
    <div
      style={{
        width: "100vw",
        height: "100vh",
        backgroundColor: "#111827",
        color: "#ffffff",
        overflow: "hidden",
      }}
    >
      <Outlet />
    </div>
  );
}