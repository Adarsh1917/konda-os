import { Save, X } from "lucide-react";

import type { WorkspaceFile } from "../types/Workspace.types";
import { useWorkspace } from "../hooks/useWorkspace";

import styles from "./EditorTab.module.css";

interface EditorTabProps {
  file: WorkspaceFile;
}

export default function EditorTab({
  file,
}: EditorTabProps) {
  const {
    activeFileId,
    setActiveFile,
    closeFile,
    saveFile,
  } = useWorkspace();

  const active = activeFileId === file.id;

  return (
    <div
      className={`${styles.tab} ${
        active ? styles.active : ""
      }`}
      onClick={() => setActiveFile(file.id)}
    >
      <span className={styles.name}>
        {file.name}
      </span>

      {file.modified && (
        <button
          aria-label={`Save ${file.name}`}
          className={styles.save}
          onClick={(event) => {
            event.stopPropagation();
            void saveFile(file.id);
          }}
          title="Save"
          type="button"
        >
          <Save size={14} />
        </button>
      )}

      <button
        className={styles.close}
        onClick={(event) => {
          event.stopPropagation();
          closeFile(file.id);
        }}
        type="button"
      >
        <X size={14} />
      </button>
    </div>
  );
}
