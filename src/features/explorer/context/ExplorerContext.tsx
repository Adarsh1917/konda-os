/* eslint-disable react-refresh/only-export-components */

import {
  createContext,
  useCallback,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import type {
  ExplorerContextState,
  ExplorerNode,
} from "../types/Explorer.types";

import {
  getProjectName,
  readDirectory,
} from "../services/ExplorerService";
import { useProjectStore } from "../../projects/store/ProjectStore";

export const ExplorerContext =
  createContext<ExplorerContextState | null>(null);

interface Props {
  children: ReactNode;
}

function findNode(
  nodes: ExplorerNode[],
  id: string
): ExplorerNode | undefined {
  for (const node of nodes) {
    if (node.id === id) {
      return node;
    }

    if (node.children) {
      const match = findNode(node.children, id);

      if (match) {
        return match;
      }
    }
  }

  return undefined;
}

function updateNode(
  nodes: ExplorerNode[],
  id: string,
  update: (node: ExplorerNode) => ExplorerNode
): ExplorerNode[] {
  return nodes.map((node) => {
    if (node.id === id) {
      return update(node);
    }

    if (node.children) {
      return {
        ...node,
        children: updateNode(
          node.children,
          id,
          update
        ),
      };
    }

    return node;
  });
}

function getErrorMessage(error: unknown): string {
  return error instanceof Error
    ? error.message
    : "Unable to access the selected project.";
}

export function ExplorerProvider({
  children,
}: Props) {
  const [tree, setTree] =
    useState<ExplorerNode[]>([]);

  const [selected, setSelected] =
    useState<string | null>(null);

  const [rootPath, setRootPath] =
    useState<string | null>(null);

  const [isLoading, setIsLoading] =
    useState(false);

  const [error, setError] =
    useState<string | null>(null);

  const setProject = useProjectStore(
    (state) => state.setProject
  );

  const loadProject = useCallback(async (
    projectPath: string
  ) => {
    setIsLoading(true);
    setError(null);

    try {
      const children = await readDirectory(
        projectPath
      );
      const name = getProjectName(projectPath);

      setTree([
        {
          id: projectPath,
          name,
          type: "folder",
          path: projectPath,
          expanded: true,
          children,
        },
      ]);

      setRootPath(projectPath);
      setSelected(null);
      setProject({ name, path: projectPath });
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [setProject]);

  const selectNode = useCallback((id: string) => {
    setSelected(id);
  }, []);

  const openProject = useCallback(async () => {
    try {
      if (!window.konda) {
        throw new Error(
          "Konda's desktop file APIs are unavailable. Start the app through Electron."
        );
      }

      const projectPath =
        await window.konda.openProject();

      if (projectPath) {
        await loadProject(projectPath);
      }
    } catch (openError) {
      setError(getErrorMessage(openError));
    }
  }, [loadProject]);

  const refresh = useCallback(async () => {
    if (rootPath) {
      await loadProject(rootPath);
    }
  }, [loadProject, rootPath]);

  const toggleFolder = useCallback(async (id: string) => {
    const node = findNode(tree, id);

    if (!node || node.type !== "folder") {
      return;
    }

    if (node.expanded || node.children) {
      setTree((previous) =>
        updateNode(previous, id, (current) => ({
          ...current,
          expanded: !current.expanded,
        }))
      );
      return;
    }

    setIsLoading(true);
    setError(null);

    try {
      const children = await readDirectory(node.path);

      setTree((previous) =>
        updateNode(previous, id, (current) => ({
          ...current,
          expanded: true,
          children,
        }))
      );
    } catch (loadError) {
      setError(getErrorMessage(loadError));
    } finally {
      setIsLoading(false);
    }
  }, [tree]);

  const reportError = useCallback((message: string | null) => {
    setError(message);
  }, []);

  const value = useMemo(
    () => ({
      tree,
      selected,
      rootPath,
      isLoading,
      error,
      selectNode,
      toggleFolder,
      openProject,
      refresh,
      reportError,
    }),
    [
      tree,
      selected,
      rootPath,
      isLoading,
      error,
      selectNode,
      toggleFolder,
      openProject,
      refresh,
      reportError,
    ]
  );

  return (
    <ExplorerContext.Provider value={value}>
      {children}
    </ExplorerContext.Provider>
  );
}
