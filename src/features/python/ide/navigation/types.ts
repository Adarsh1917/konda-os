import type {
  NavigationContextValue,
  WorkspaceView,
} from "../../../../shared/types/workspace";

export type NavigationView = WorkspaceView;

export interface NavigationAction {
  id: NavigationView;
  label: string;
  icon: string;
  tooltip: string;
}

export interface NavigationProviderProps {
  children: React.ReactNode;
}

export interface NavigationState {
  activeView: NavigationView;
  collapsed: boolean;
}

export interface NavigationContextType
  extends NavigationContextValue {}

export interface SidebarSection {
  id: string;
  title: string;
  visibleFor: NavigationView[];
}

export interface NavigationStorage {
  activeView: NavigationView;
  collapsed: boolean;
}

export const NAVIGATION_STORAGE_KEY =
  "konda.ide.navigation";

export const DEFAULT_NAVIGATION_STATE: NavigationState =
  {
    activeView: "explorer",
    collapsed: false,
  };

export const NAVIGATION_ACTIONS: readonly NavigationAction[] =
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
      label: "Run & Debug",
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
      tooltip: "Konda AI Assistant",
    },
  ] as const;