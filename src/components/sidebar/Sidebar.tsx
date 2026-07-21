import "./Sidebar.css";

import { navigation } from "../../data/navigation";
import SidebarItem from "./SidebarItem";

function Sidebar() {
  return (
    <aside className="sidebar">
      {/* Logo Section */}
      <div className="sidebar-logo">
        <div className="logo-circle">K</div>

        <div>
          <h2>Konda OS</h2>
          <p>Your Personal AI Workspace</p>
        </div>
      </div>

      {/* Navigation */}
      <nav className="sidebar-nav">
        {navigation.map((item) => (
          <SidebarItem
            key={item.path}
            title={item.title}
            path={item.path}
            icon={item.icon}
          />
        ))}
      </nav>

      {/* Footer */}
      <div className="sidebar-footer">
        <div className="user-avatar">A</div>

        <div>
          <h4>Adarsh</h4>
          <p>Student</p>
        </div>

        <span className="version">v0.2 Alpha</span>
      </div>
    </aside>
  );
}

export default Sidebar;