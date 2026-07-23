import "./PythonWorkspace.css";
import Editor from "@monaco-editor/react";

import Explorer from "./components/Explorer";
import Tabs from "./components/Tabs";

import { useWorkspace } from "./hooks/useWorkspace";

export default function PythonWorkspace() {
  const {
    project,

    activeFile,
    updateActiveFile,

    openTabs,
    activeTabId,

    openFile,
    closeTab,
    
    setActiveTabId,
    setActiveFile,
    
    createFolder,
    createFile,

    renameItem,
    deleteItem,
  } = useWorkspace();

  return (
    <div className="flex h-screen bg-zinc-950 text-white">
      {/* ================= Explorer ================= */}

      <div className="w-64 border-r border-zinc-800 overflow-auto">
        <Explorer
            project={project}
            onOpenFile={openFile}
            createFolder={createFolder}
            createFile={createFile}
            renameItem={renameItem}
            deleteItem={deleteItem}
          />
        
        
      </div>

      {/* ================= Workspace ================= */}

      <div className="flex flex-1 flex-col">
        {/* Tabs */}

        <Tabs
          tabs={openTabs}
          activeTabId={activeTabId}
          onSelect={(id) => {
            setActiveTabId(id);

            const findFile = (nodes: typeof project): any => {
              for (const node of nodes) {
                if (node.type === "file" && node.id === id) {
                  return node;
                }

                if (node.children) {
                  const result = findFile(node.children);

                  if (result) return result;
                }
              }

              return null;
            };

            const file = findFile(project);

            if (file) {
              setActiveFile(file);
            }
          }}
          onClose={closeTab}
        />

        {/* Editor */}

        <div className="flex-1">
          {activeFile ? (
            <Editor
              height="100%"
              language="python"
              value={activeFile.content ?? ""}
              theme="vs-dark"
              onChange={(value) =>
                updateActiveFile(value ?? "")
              }
              options={{
                fontSize: 15,
                minimap: {
                  enabled: false,
                },
                automaticLayout: true,
                scrollBeyondLastLine: false,
              }}
            />
          ) : (
            <div className="h-full flex items-center justify-center text-zinc-500">
              Open a file from Explorer
            </div>
          )}
        </div>
      </div>
    </div>
  );
}