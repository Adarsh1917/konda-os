import "./PythonWorkspace.css";
import { useState } from "react";
import Editor from "@monaco-editor/react";

import Explorer from "./Explorer";
import NewFileDialog from "./NewFileDialog";

import type { FileNode } from "./types";

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
        content: `# Python Project

This is your first project.`,
      },
    ],
  },
];

export default function PythonWorkspace() {
  const [project, setProject] =
    useState<FileNode[]>(initialProject);

  const [activeFile, setActiveFile] =
    useState<FileNode | null>(
      initialProject[0].children?.[0] ?? null
    );

  const [showDialog, setShowDialog] =
    useState(false);

  const createNewFile = (fileName: string) => {
    if (!fileName.trim()) return;

    const root = project[0];

    if (!root.children) return;

    const exists = root.children.some(
      (file) => file.name === fileName
    );

    if (exists) {
      alert("File already exists.");
      return;
    }

    const newFile: FileNode = {
      id: crypto.randomUUID(),
      name: fileName,
      type: "file",
      content: "",
    };

    const updatedProject = [
      {
        ...root,
        children: [...root.children, newFile],
      },
    ];

    setProject(updatedProject);

    setActiveFile(newFile);

    setShowDialog(false);
  };

  const updateActiveFile = (
    value: string | undefined
  ) => {
    if (!activeFile) return;

    const updatedProject = project.map((folder) => ({
      ...folder,
      children: folder.children?.map((file) =>
        file.id === activeFile.id
          ? {
              ...file,
              content: value ?? "",
            }
          : file
      ),
    }));

    setProject(updatedProject);

    setActiveFile({
      ...activeFile,
      content: value ?? "",
    });
  };
    return (
    <div className="python-workspace">
      <div className="python-header">
        <div>
          <h1>🐍 Python Workspace</h1>
          <p>Build Python projects with Konda AI</p>
        </div>

        <div className="header-buttons">
          <button onClick={() => setShowDialog(true)}>
            + New File
          </button>

          <button>▶ Run</button>
        </div>
      </div>

      <div className="python-layout">
        <Explorer
          project={project}
          onOpenFile={(node) => {
            setActiveFile(node);
          }}
        />

        <main className="editor">
          <h3>Editor</h3>

          <div className="editor-tabs">
            <div className="tab active-tab">
              {activeFile?.name ?? "No File"}
            </div>
          </div>

          <Editor
            height="390px"
            theme="vs-dark"
            language={
              activeFile?.name.endsWith(".md")
                ? "markdown"
                : "python"
            }
            value={activeFile?.content ?? ""}
            onChange={updateActiveFile}
            options={{
              automaticLayout: true,
              minimap: {
                enabled: false,
              },
              fontSize: 15,
            }}
          />
        </main>

        <aside className="assistant">
          <h3>🤖 Konda AI</h3>

          <div className="assistant-card">
            Explain Code
          </div>

          <div className="assistant-card">
            Fix Errors
          </div>

          <div className="assistant-card">
            Optimize Code
          </div>
        </aside>
      </div>

      <div className="terminal">
        <h3>Terminal</h3>

        <div className="terminal-box">
          Output will appear here...
        </div>
      </div>

      <NewFileDialog
        open={showDialog}
        onClose={() => setShowDialog(false)}
        onCreate={createNewFile}
      />
    </div>
  );
}