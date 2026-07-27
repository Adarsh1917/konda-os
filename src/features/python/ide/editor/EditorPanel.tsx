import "./EditorPanel.css";

import { useWorkspaceContext } from "../../context/WorkspaceContext";

import { useEditor } from "../../hooks/useEditor";

import Tabs from "../tabs/Tabs";
import MonacoEditor from "./MonacoEditor";
import EmptyEditor from "./EmptyEditor";

export default function EditorPanel() {
  const {
    activeFile,
    updateActiveFile,
  } = useWorkspaceContext();

  const {
    value,
    updateValue,
  } = useEditor({
    activeFileId: activeFile?.id ?? null,
    content: activeFile?.content ?? "",
    onSave: updateActiveFile,
  });

  return (
    <div className="editor-panel">
      <Tabs />

      {!activeFile ? (
        <EmptyEditor />
      ) : (
        <div className="editor-content">
          <MonacoEditor
            value={value}
            language="python"
            onChange={updateValue}
          />
        </div>
      )}
    </div>
  );
}