import "./AppLayout.css";

import Sidebar from "../ui/home/Sidebar";
import TopBar from "../ui/home/TopBar";

type AppLayoutProps = {
  children: React.ReactNode;
};

const AppLayout = ({ children }: AppLayoutProps) => {
  return (
    <div className="app-layout">
      <Sidebar />

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