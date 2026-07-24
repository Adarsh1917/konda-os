export type WorkspaceView =
  | "explorer"
  | "search"
  | "source-control"
  | "run"
  | "extensions"
  | "ai";

export interface ActivityItem {
  id: WorkspaceView;
  label: string;
  icon: string;
  tooltip: string;
}

export interface NavigationState {
  activeView: WorkspaceView;
  collapsed: boolean;
}

export interface NavigationContextValue {
  activeView: WorkspaceView;

  collapsed: boolean;

  setActiveView: (
    view: WorkspaceView
  ) => void;

  toggleSidebar: () => void;

  expandSidebar: () => void;

  collapseSidebar: () => void;
}

export interface OpenTab {
  id: string;
  name: string;
}

export interface WorkspaceLayoutState {
  sidebarWidth: number;

  activityBarWidth: number;

  terminalHeight: number;

  panelVisible: boolean;
}

export const DEFAULT_LAYOUT: WorkspaceLayoutState =
  {
    sidebarWidth: 280,

    activityBarWidth: 52,

    terminalHeight: 240,

    panelVisible: true,
  };

export const DEFAULT_NAVIGATION: NavigationState =
  {
    activeView: "explorer",

    collapsed: false,
  };

export const ACTIVITY_ITEMS: readonly ActivityItem[] =
  [
    {
      id: "explorer",
      label: "Explorer",
      icon: "📁",
      tooltip: "Explorer",
    },
    {
      id: "search",
      label: "Search",
      icon: "🔍",
      tooltip: "Search",
    },
    {
      id: "source-control",
      label: "Source Control",
      icon: "🌿",
      tooltip: "Source Control",
    },
    {
      id: "run",
      label: "Run",
      icon: "▶",
      tooltip: "Run & Debug",
    },
    {
      id: "extensions",
      label: "Extensions",
      icon: "🧩",
      tooltip: "Extensions",
    },
    {
      id: "ai",
      label: "Konda AI",
      icon: "🤖",
      tooltip: "Konda AI",
    },
  ] as const;