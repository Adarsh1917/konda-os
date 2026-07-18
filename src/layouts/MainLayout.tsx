import Header from "../components/Header";
import Sidebar from "../components/sidebar/Sidebar";
import { Outlet } from "react-router-dom";

function MainLayout() {
  return (
    <div className="app">
      <Sidebar />

      <div className="main-content">
        <Header />
        <Outlet />
      </div>
    </div>
  );
}

export default MainLayout;