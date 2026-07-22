import "./PythonWorkspace.css";
import Editor from "@monaco-editor/react";
import { useState } from "react";
import NewFileDialog from "./NewFileDialog";

const initialFiles: Record<string, string> = {
  "main.py": `print("Welcome to Konda OS")`,

  "utils.py": `def add(a, b):
    return a + b`,

  "README.md": `# Python Project

This is your first project.`,
};

const PythonWorkspace = () => {
  const [files, setFiles] = useState(initialFiles);
  const [activeFile, setActiveFile] = useState("main.py");
  const [showDialog, setShowDialog] = useState(false);

  const createNewFile = (fileName: string) => {
    if (!fileName.trim()) return;

    if (files[fileName]) {
      alert("File already exists.");
      return;
    }

    setFiles((prev) => ({
      ...prev,
      [fileName]: "",
    }));

    setActiveFile(fileName);
    setShowDialog(false);
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
        <aside className="explorer">
          <h3>Explorer</h3>

          {Object.keys(files).map((file) => (
            <div
              key={file}
              className={
                activeFile === file
                  ? "file-item active-file"
                  : "file-item"
              }
              onClick={() => setActiveFile(file)}
            >
              📄 {file}
            </div>
          ))}
        </aside>

        <main className="editor">
          <h3>Editor</h3>

          <div className="editor-tabs">
            <div className="tab active-tab">
              {activeFile}
            </div>
          </div>

          <Editor
            height="390px"
            theme="vs-dark"
            language={
              activeFile.endsWith(".md")
                ? "markdown"
                : "python"
            }
            value={files[activeFile]}
            onChange={(value) =>
              setFiles((prev) => ({
                ...prev,
                [activeFile]: value ?? "",
              }))
            }
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
};

export default PythonWorkspace;