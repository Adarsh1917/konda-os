import {
  LayoutDashboard,
  Bot,
  NotebookPen,
  FolderOpen,
  GraduationCap,
  CalendarDays,
  CheckSquare,
  Sparkles,
  Settings,
} from "lucide-react";

export const navigation = [
  {
    title: "Dashboard",
    path: "/",
    icon: LayoutDashboard,
  },
  {
    title: "Konda AI",
    path: "/chat",
    icon: Bot,
  },
  {
    title: "Notes",
    path: "/notes",
    icon: NotebookPen,
  },
  {
    title: "Files",
    path: "/files",
    icon: FolderOpen,
  },
  {
    title: "Study",
    path: "/study",
    icon: GraduationCap,
  },
  {
    title: "Calendar",
    path: "/calendar",
    icon: CalendarDays,
  },
  {
    title: "Tasks",
    path: "/tasks",
    icon: CheckSquare,
  },
  {
    title: "AI Tools",
    path: "/ai-tools",
    icon: Sparkles,
  },
  {
    title: "Settings",
    path: "/settings",
    icon: Settings,
  },
];