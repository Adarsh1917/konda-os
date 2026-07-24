import "./PythonWorkspace.css";

import Editor from "@monaco-editor/react";

import ProjectHeader from "./components/project/ProjectHeader";
import StatusBar from "./components/statusbar/StatusBar";

import Explorer from "./components/Explorer";
import Tabs from "./components/Tabs";

import { useWorkspace } from "./hooks/useWorkspace";
import { useEditor } from "./hooks/useEditor";

export default function PythonWorkspace() {
  const {
    project,

    activeFile,
    activeTabId,
    openTabs,

    updateActiveFile,

    openFile,
    selectTab,
    closeTab,

    createFolder,
    createFile,

    renameItem,
    deleteItem,
  } = useWorkspace();

  const editor = useEditor({
    activeFileId: activeFile?.id ?? null,
    content: activeFile?.content ?? "",
    onSave: updateActiveFile,
  });

  return (
    <div className="flex h-screen bg-zinc-950 text-white flex-col">
      <div className="flex flex-1 overflow-hidden">
        {/* Explorer */}
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

        {/* Editor Area */}
        <div className="flex flex-1 flex-col">
          <ProjectHeader
            projectName="Untitled Project"
            saved={true}
          />

          <Tabs
            tabs={openTabs}
            activeTabId={activeTabId}
            onSelect={selectTab}
            onClose={closeTab}
          />

          <div className="flex-1">
            {activeFile ? (
              <Editor
                height="100%"
                language="python"
                value={editor.value}
                theme="vs-dark"
                onChange={(value) =>
                  editor.updateValue(value ?? "")
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

      {/* IDE Status Bar */}
      <StatusBar />
    </div>
  );
}