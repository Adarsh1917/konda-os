import { NavLink } from "react-router-dom";
import type { LucideIcon } from "lucide-react";

interface SidebarItemProps {
  title: string;
  path: string;
  icon: LucideIcon;
}

function SidebarItem({
  title,
  path,
  icon: Icon,
}: SidebarItemProps) {
  return (
    <NavLink
      to={path}
      className={({ isActive }) =>
        `sidebar-item ${isActive ? "active" : ""}`
      }
    >
      <Icon size={20} />
      <span>{title}</span>
    </NavLink>
  );
}

export default SidebarItem;