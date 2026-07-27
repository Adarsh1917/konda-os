import { useEffect, useRef, useState } from "react";
import type { FileNode } from "../types";

import { initialProject } from "../data/project";

import {
  loadWorkspace,
  saveWorkspace,
  type WorkspaceState,
} from "../storage/workspaceStorage";

import {
  findFileById,
  findFolderById,
  generateId,
  renameNode,
  deleteNode,
  findNodeById,
} from "../../shared/components/tree";

interface OpenTab {
  id: string;
  name: string;
}

function createDefaultWorkspace() {
  const firstFile = findFileById(initialProject, "main");

  return {
    project: initialProject,
    activeFile: firstFile ?? null,
    activeTabId: firstFile?.id ?? null,
    openTabs: firstFile
      ? [
          {
            id: firstFile.id,
            name: firstFile.name,
          },
        ]
      : [],
  };
}

export function useWorkspace() {
  const defaults = createDefaultWorkspace();

  const restored = loadWorkspace();

  const initialProjectState =
    restored?.project ?? defaults.project;

  const initialOpenTabs =
    restored?.openTabs ?? defaults.openTabs;

  const initialActiveTab =
    restored?.activeTabId ?? defaults.activeTabId;

  const initialActiveFile =
    initialActiveTab == null
      ? null
      : findFileById(
          initialProjectState,
          initialActiveTab
        );

  const [project, setProject] =
    useState<FileNode[]>(initialProjectState);

  const [activeFile, setActiveFile] =
    useState<FileNode | null>(
      initialActiveFile
    );

  const [activeTabId, setActiveTabId] =
    useState<string | null>(
      initialActiveTab
    );

  const [openTabs, setOpenTabs] =
    useState<OpenTab[]>(
      initialOpenTabs
    );

  const [showDialog, setShowDialog] =
    useState(false);

  const initialized = useRef(false);

  /* ===========================
     Initial Sync
  =========================== */

  useEffect(() => {
    if (activeTabId == null) {
      setActiveFile(null);
      initialized.current = true;
      return;
    }

    const file = findFileById(
      project,
      activeTabId
    );

    setActiveFile(file ?? null);

    initialized.current = true;
  }, []);

  /* ===========================
     Auto Save
  =========================== */

  useEffect(() => {
    if (!initialized.current) return;

    const workspace: WorkspaceState = {
      project,
      openTabs,
      activeTabId,
    };

    saveWorkspace(workspace);
  }, [project, openTabs, activeTabId]);

  /* ===========================
     Update File
  =========================== */

  const updateActiveFile = (
    content: string
  ) => {
    if (!activeFile) return;

    activeFile.content = content;

    setProject([...project]);

    setActiveFile({
      ...activeFile,
      content,
    });
  };

  /* ===========================
     Open File
  =========================== */

  const openFile = (file: FileNode) => {
    setActiveFile(file);

    setActiveTabId(file.id);

    setOpenTabs((tabs) => {
      const exists = tabs.some(
        (tab) => tab.id === file.id
      );

      if (exists) {
        return tabs;
      }

      return [
        ...tabs,
        {
          id: file.id,
          name: file.name,
        },
      ];
    });
  };

  /* ===========================
     Select Tab
  =========================== */

  const selectTab = (id: string) => {
    setActiveTabId(id);

    const file = findFileById(
      project,
      id
    );

    setActiveFile(file ?? null);
  };

  /* ===========================
     Close Tab
  =========================== */
    const closeTab = (id: string) => {
    const index = openTabs.findIndex(
      (tab) => tab.id === id
    );

    const updatedTabs = openTabs.filter(
      (tab) => tab.id !== id
    );

    setOpenTabs(updatedTabs);

    if (activeTabId !== id) {
      return;
    }

    if (updatedTabs.length === 0) {
      setActiveTabId(null);
      setActiveFile(null);
      return;
    }

    const nextTab =
      updatedTabs[index] ??
      updatedTabs[index - 1] ??
      updatedTabs[0];

    setActiveTabId(nextTab.id);

    const file = findFileById(
      project,
      nextTab.id
    );

    setActiveFile(file ?? null);
  };

  /* ===========================
     Create Folder
  =========================== */

  const createFolder = (
    parentId: string,
    folderName: string
  ) => {
    const folder = findFolderById(
      project,
      parentId
    );

    if (!folder) return;

    if (!folder.children) {
      folder.children = [];
    }

    folder.children.push({
      id: generateId(),
      name: folderName.trim(),
      type: "folder",
      expanded: true,
      children: [],
    });

    setProject([...project]);
  };

  /* ===========================
     Create File
  =========================== */

  const createFile = (
    parentId: string,
    fileName: string
  ) => {
    const folder = findFolderById(
      project,
      parentId
    );

    if (!folder) return;

    if (!folder.children) {
      folder.children = [];
    }

    folder.children.push({
      id: generateId(),
      name: fileName.trim(),
      type: "file",
      content: "",
    });

    setProject([...project]);
  };

  /* ===========================
     Rename
  =========================== */

  const renameItem = (
    id: string,
    newName: string
  ) => {
    const name = newName.trim();

    if (!name) return;

    const renamed = renameNode(
      project,
      id,
      name
    );

    if (!renamed) {
      alert(
        "A file or folder with this name already exists."
      );
      return;
    }

    setProject([...project]);

    setOpenTabs((tabs) =>
      tabs.map((tab) =>
        tab.id === id
          ? {
              ...tab,
              name,
            }
          : tab
      )
    );

    if (activeFile?.id === id) {
      const updated = findNodeById(
        project,
        id
      );

      if (
        updated &&
        updated.type === "file"
      ) {
        setActiveFile({
          ...updated,
        });
      }
    }
  };

  /* ===========================
     Delete
  =========================== */

  const deleteItem = (id: string) => {
    const confirmed =
      window.confirm(
        "Delete this item?"
      );

    if (!confirmed) return;

    const deleted = deleteNode(
      project,
      id
    );

    if (!deleted) return;

    const remainingTabs =
      openTabs.filter(
        (tab) => tab.id !== id
      );

    setOpenTabs(remainingTabs);

    if (activeFile?.id === id) {
      if (remainingTabs.length > 0) {
        const nextTab =
          remainingTabs[
            remainingTabs.length - 1
          ];

        setActiveTabId(nextTab.id);

        const nextFile =
          findFileById(
            project,
            nextTab.id
          );

        setActiveFile(
          nextFile ?? null
        );
      } else {
        setActiveTabId(null);
        setActiveFile(null);
      }
    }

    setProject([...project]);
  };

  return {
    project,
    setProject,

    activeFile,
    setActiveFile,

    activeTabId,
    setActiveTabId,

    openTabs,

    showDialog,
    setShowDialog,

    updateActiveFile,

    openFile,
    selectTab,
    closeTab,

    createFolder,
    createFile,

    renameItem,
    deleteItem,
    setOpenTabs,
  };
}