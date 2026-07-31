import "./AppLayout.css";

import Sidebar from "../components/sidebar/Sidebar";
import Header from "../components/header/Header";
type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="app-layout">
      <Header />

      <div className="app-main">
        <TopBar />

        <main className="app-content">
          {children}
        </main>
      </div>
    </div>
  );
};

export default AppLayout;