import "./PythonWorkspace.css";
import { useWorkspace } from "./hooks/useWorkspace";

import Explorer from "./components/Explorer";
import Tabs from "./components/Tabs";

import Editor from "@monaco-editor/react";

export default function PythonWorkspace() {
  const {
    project,
    activeFile,
    setActiveFile,
  } = useWorkspace();

  return (
    <div className="flex h-screen">
      {/* Explorer */}
      <Explorer
        project={project}
        onOpenFile={setActiveFile}
      />

      {/* Editor Area */}
      <div className="flex-1 flex flex-col">
        <Tabs
          tabs={
            activeFile
              ? [{ id: activeFile.id, name: activeFile.name }]
              : []
          }
          activeTabId={activeFile?.id ?? null}
          onSelect={() => {}}
          onClose={() => {}}
        />

        <div className="flex-1">
          <Editor
            height="100%"
            defaultLanguage="python"
            value={activeFile?.content ?? ""}
            theme="vs-dark"
            options={{
              minimap: { enabled: false },
              fontSize: 15,
            }}
          />
        </div>
      </div>
    </div>
  );
}