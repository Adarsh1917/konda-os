import MonacoEditor from "./MonacoEditor";

import { useWorkspace } from "../../features/python/hooks/useWorkspace";

export default function EditorPanel() {
  const {
    activeFile,
    updateActiveFile,
  } = useWorkspace();

  if (!activeFile) {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#8b949e",
          fontSize: "15px",
        }}
      >
        Open a file from the Explorer to start coding.
      </div>
    );
  }

  if (activeFile.type !== "file") {
    return (
      <div
        style={{
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          width: "100%",
          height: "100%",
          color: "#8b949e",
          fontSize: "15px",
        }}
      >
        Select a file to edit.
      </div>
    );
  }

  return (
    <MonacoEditor
      value={activeFile.content ?? ""}
      language="python"
      onChange={updateActiveFile}
    />
  );
}