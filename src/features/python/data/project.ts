import type { FileNode } from "../types";

export const initialProject: FileNode[] = [
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