import {
  createContext,
  useCallback,
  useEffect,
  useMemo,
  useState,
} from "react";

import type {
  NavigationContextValue,
  WorkspaceView,
} from "../../../../shared/types/workspace";

import {
  DEFAULT_NAVIGATION_STATE,
  NAVIGATION_STORAGE_KEY,
} from "./types";

export const NavigationContext =
  createContext<NavigationContextValue | null>(
    null
  );

interface NavigationProviderState {
  activeView: WorkspaceView;
  collapsed: boolean;
}

interface NavigationContextProviderProps {
  children: React.ReactNode;
}

function loadState(): NavigationProviderState {
  try {
    const raw = localStorage.getItem(
      NAVIGATION_STORAGE_KEY
    );

    if (!raw) {
      return DEFAULT_NAVIGATION_STATE;
    }

    const parsed = JSON.parse(
      raw
    ) as NavigationProviderState;

    return {
      activeView:
        parsed.activeView ??
        DEFAULT_NAVIGATION_STATE.activeView,

      collapsed:
        parsed.collapsed ??
        DEFAULT_NAVIGATION_STATE.collapsed,
    };
  } catch {
    return DEFAULT_NAVIGATION_STATE;
  }
}

export function NavigationContextProvider({
  children,
}: NavigationContextProviderProps) {
  const initial = useMemo(
    () => loadState(),
    []
  );

  const [activeView, setActiveViewState] =
    useState<WorkspaceView>(
      initial.activeView
    );

  const [collapsed, setCollapsed] =
    useState<boolean>(
      initial.collapsed
    );

  useEffect(() => {
    localStorage.setItem(
      NAVIGATION_STORAGE_KEY,
      JSON.stringify({
        activeView,
        collapsed,
      })
    );
  }, [activeView, collapsed]);

  const setActiveView = useCallback(
    (view: WorkspaceView) => {
      setActiveViewState(view);

      if (collapsed) {
        setCollapsed(false);
      }
    },
    [collapsed]
  );

  const toggleSidebar =
    useCallback(() => {
      setCollapsed((value) => !value);
    }, []);

  const expandSidebar =
    useCallback(() => {
      setCollapsed(false);
    }, []);

  const collapseSidebar =
    useCallback(() => {
      setCollapsed(true);
    }, []);

  const value =
    useMemo<NavigationContextValue>(
      () => ({
        activeView,

        collapsed,

        setActiveView,

        toggleSidebar,

        expandSidebar,

        collapseSidebar,
      }),
      [
        activeView,
        collapsed,
        setActiveView,
        toggleSidebar,
        expandSidebar,
        collapseSidebar,
      ]
    );

  return (
    <NavigationContext.Provider
      value={value}
    >
      {children}
    </NavigationContext.Provider>
  );
}

export default NavigationContext;