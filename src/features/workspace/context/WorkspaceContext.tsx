/* eslint-disable react-refresh/only-export-components */

import {
  useCallback,
  createContext,
  useMemo,
  useState,
} from "react";

import type { ReactNode } from "react";

import type {
  WorkspaceContextState,
  WorkspaceFile,
} from "../types/Workspace.types";

export const WorkspaceContext =
  createContext<WorkspaceContextState | null>(null);

interface Props {
  children: ReactNode;
}

export function WorkspaceProvider({
  children,
}: Props) {
  const [files, setFiles] =
    useState<WorkspaceFile[]>([]);

  const [activeFileId, setActiveFileId] =
    useState<string | null>(null);

  const [savingFileId, setSavingFileId] =
    useState<string | null>(null);

  const [error, setError] =
    useState<string | null>(null);

  const openFile = useCallback((file: WorkspaceFile) => {
    setActiveFileId(file.id);

    setFiles((previous) => {
      const exists = previous.find(
        (item) => item.id === file.id
      );

      if (exists) {
        return previous;
      }

      return [...previous, file];
    });
  }, []);

  const closeFile = useCallback((id: string) => {
    const index = files.findIndex(
      (file) => file.id === id
    );
    const file = files[index];

    if (!file) {
      return;
    }

    if (
      file.modified &&
      !window.confirm(
        `Discard unsaved changes to ${file.name}?`
      )
    ) {
      return;
    }

    const next = files.filter(
      (item) => item.id !== id
    );

    setFiles(next);

    setActiveFileId((current) =>
      current === id
        ? (next[index]?.id ??
          next[index - 1]?.id ??
          null)
        : current
    );
  }, [files]);

  const updateFileContent = useCallback((
    id: string,
    content: string
  ) => {
    setFiles((previous) =>
      previous.map((file) =>
        file.id === id && file.content !== content
          ? {
              ...file,
              content,
              modified: true,
            }
          : file
      )
    );
  }, []);

  const saveFile = useCallback(async (id: string) => {
    const file = files.find(
      (item) => item.id === id
    );

    if (!file || !file.modified) {
      return;
    }

    setSavingFileId(id);
    setError(null);

    try {
      if (!window.konda) {
        throw new Error(
          "Konda's desktop file APIs are unavailable. Start the app through Electron."
        );
      }

      const written = await window.konda.writeFile(
        file.path,
        file.content
      );

      if (!written) {
        throw new Error(`Unable to save ${file.name}.`);
      }

      setFiles((previous) =>
        previous.map((current) =>
          current.id === id &&
          current.content === file.content
            ? { ...current, modified: false }
            : current
        )
      );
    } catch (saveError) {
      setError(
        saveError instanceof Error
          ? saveError.message
          : `Unable to save ${file.name}.`
      );
    } finally {
      setSavingFileId((current) =>
        current === id ? null : current
      );
    }
  }, [files]);

  const value = useMemo(
    () => ({
      files,
      activeFileId,
      savingFileId,
      error,
      openFile,
      closeFile,
      setActiveFile: setActiveFileId,
      updateFileContent,
      saveFile,
    }),
    [
      files,
      activeFileId,
      savingFileId,
      error,
      openFile,
      closeFile,
      updateFileContent,
      saveFile,
    ]
  );

  return (
    <WorkspaceContext.Provider value={value}>
      {children}
    </WorkspaceContext.Provider>
  );
}
