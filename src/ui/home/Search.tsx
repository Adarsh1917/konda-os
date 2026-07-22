import { NavLink } from "react-router-dom";
import {
  House,
  BookOpen,
  Code2,
  Brain,
  FolderOpen,
  Calendar,
  Settings,
  User,
} from "lucide-react";

const menuItems = [
  { icon: House, label: "Home", path: "/home" },
  { icon: BookOpen, label: "Study", path: "/study" },
  { icon: Code2, label: "Code", path: "/code" },
  { icon: Brain, label: "Memory", path: "/memory" },
  { icon: FolderOpen, label: "Files", path: "/files" },
  { icon: Calendar, label: "Calendar", path: "/calendar" },
];

const Sidebar = () => {
  return (
    <aside className="sidebar">
      {/* Logo */}

      <nav className="menu">
        {menuItems.map((item) => {
          const Icon = item.icon;

          return (
            <NavLink
              key={item.label}
              to={item.path}
              className={({ isActive }) =>
                `menu-item ${isActive ? "active" : ""}`
              }
            >
              <Icon size={20} />
              <span>{item.label}</span>
            </NavLink>
          );
        })}
      </nav>

      {/* Footer */}
    </aside>
  );
};

export default Sidebar;