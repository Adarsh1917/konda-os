import { useState } from "react";
import type { FileNode } from "../types";

const initialProject: FileNode[] = [
  {
    id: "project",
    name: "Python Project",
    type: "folder",
    expanded: true,
    children: [
      {
        id: "main",
        name: "main.py",
        type: "file",
        content: `print("Welcome to Konda OS")`,
      },
      {
        id: "utils",
        name: "utils.py",
        type: "file",
        content: `def add(a, b):
    return a + b`,
      },
      {
        id: "readme",
        name: "README.md",
        type: "file",
        content: `# Python Project`,
      },
    ],
  },
];

export function useWorkspace() {
  const [project, setProject] = useState<FileNode[]>(initialProject);

  const [activeFile, setActiveFile] = useState<FileNode | null>(
    initialProject[0].children?.[0] ?? null
  );

  const [showDialog, setShowDialog] = useState(false);

  return {
    project,
    setProject,

    activeFile,
    setActiveFile,

    showDialog,
    setShowDialog,
  };
}