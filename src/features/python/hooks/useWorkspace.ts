import { useState } from "react";
import type { FileNode } from "../types";

import { initialProject } from "../data/project";

import {
  findFileById,
  findFolderById,
  generateId,
  renameNode,
  deleteNode,
  findNodeById,
} from "../utils/tree";
;

interface OpenTab {
  id: string;
  name: string;
}

export function useWorkspace() {
  const [project, setProject] =
    useState<FileNode[]>(initialProject);

  const firstFile = findFileById(initialProject, "main");

  const [activeFile, setActiveFile] =
    useState<FileNode | null>(firstFile);

  const [activeTabId, setActiveTabId] =
    useState<string | null>(firstFile?.id ?? null);

  const [openTabs, setOpenTabs] = useState<OpenTab[]>(
    firstFile
      ? [
          {
            id: firstFile.id,
            name: firstFile.name,
          },
        ]
      : []
  );

  const [showDialog, setShowDialog] =
    useState(false);

  /* ===========================
     Update File
  =========================== */

  const updateActiveFile = (content: string) => {
    if (!activeFile) return;

    activeFile.content = content;

    setActiveFile({ ...activeFile });
    setProject([...project]);
  };

  /* ===========================
     Open File
  =========================== */

  const openFile = (file: FileNode) => {
    setActiveFile(file);
    setActiveTabId(file.id);

    const exists = openTabs.some(
      (tab) => tab.id === file.id
    );

    if (!exists) {
      setOpenTabs((prev) => [
        ...prev,
        {
          id: file.id,
          name: file.name,
        },
      ]);
    }
  };

  /* ===========================
     Select Tab
  =========================== */

  const selectTab = (id: string) => {
    setActiveTabId(id);

    const file = findFileById(project, id);

    if (file) {
      setActiveFile(file);
    }
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

    if (activeTabId !== id) return;

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

    const file = findFileById(project, nextTab.id);

    if (file) {
      setActiveFile(file);
    }
  };

  /* ===========================
     Create Folder (Foundation)
  =========================== */

  const createFolder = (
    parentId: string,
    folderName: string
  ) => {
    const folder = findFolderById(project, parentId);

    if (!folder) return;

    if (!folder.children) {
      folder.children = [];
    }

    folder.children.push({
      id: generateId(),
      name: folderName,
      type: "folder",
      expanded: true,
      children: [],
    });

    setProject([...project]);
  };

  /* ===========================
     Create File (Foundation)
  =========================== */

  const createFile = (
    parentId: string,
    fileName: string
  ) => {
    const folder = findFolderById(project, parentId);

    if (!folder) return;

    if (!folder.children) {
      folder.children = [];
    }

    folder.children.push({
      id: generateId(),
      name: fileName,
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
  const renamed = renameNode(
    project,
    id,
    newName.trim()
  );

  if (!renamed) {
    alert("A file or folder with this name already exists.");
    return;
  }

  setProject([...project]);

  if (activeFile?.id === id) {
    const updated = findNodeById(project, id);

    if (updated && updated.type === "file") {
      setActiveFile({ ...updated });
    }
  }
};

/* ===========================
   Delete
=========================== */

const deleteItem = (id: string) => {
  const confirmed = window.confirm(
    "Delete this item?"
  );

  if (!confirmed) return;

  const deleted = deleteNode(project, id);

  if (!deleted) return;

  if (activeFile?.id === id) {
    setActiveFile(null);
    setActiveTabId(null);

    setOpenTabs((tabs) =>
      tabs.filter((tab) => tab.id !== id)
    );
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
  };
}