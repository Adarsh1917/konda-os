import Editor from "@monaco-editor/react";

import { useWorkspace } from "../hooks/useWorkspace";

import styles from "./MonacoEditor.module.css";

function language(name: string) {
  const lower = name.toLowerCase();

  if (lower.endsWith(".ts")) return "typescript";
  if (lower.endsWith(".tsx")) return "typescript";
  if (lower.endsWith(".js")) return "javascript";
  if (lower.endsWith(".jsx")) return "javascript";
  if (lower.endsWith(".json")) return "json";
  if (lower.endsWith(".css")) return "css";
  if (lower.endsWith(".html")) return "html";
  if (lower.endsWith(".md")) return "markdown";
  if (lower.endsWith(".py")) return "python";

  return "plaintext";
}

export default function MonacoEditor() {
  const {
    files,
    activeFileId,
    saveFile,
    updateFileContent,
  } = useWorkspace();

  const file = files.find(
    (item) => item.id === activeFileId
  );

  if (!file) {
    return (
      <div className={styles.empty}>
        <h2>Konda IDE</h2>

        <p>Select a file from Explorer.</p>
      </div>
    );
  }

  return (
    <Editor
      key={file.id}
      height="100%"
      language={language(file.name)}
      theme="vs-dark"
      value={file.content}
      onChange={(value) =>
        updateFileContent(
          file.id,
          value ?? ""
        )
      }
      onMount={(editor, monaco) => {
        editor.addAction({
          id: `save-${file.id}`,
          label: "Save File",
          keybindings: [
            monaco.KeyMod.CtrlCmd |
              monaco.KeyCode.KeyS,
          ],
          run: () => {
            void saveFile(file.id);
          },
        });
      }}
      options={{
        automaticLayout: true,
        minimap: {
          enabled: true,
        },
        fontSize: 14,
        smoothScrolling: true,
        wordWrap: "on",
      }}
    />
  );
}
