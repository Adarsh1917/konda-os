import styles from "./StatusBar.module.css";

import { useWorkspace } from "../../features/workspace/hooks/useWorkspace";

export default function StatusBar() {
  const {
    activeFileId,
    error,
    files,
    savingFileId,
  } = useWorkspace();

  const activeFile = files.find(
    (file) => file.id === activeFileId
  );

  const status = error
    ? error
    : savingFileId
      ? "Saving…"
      : activeFile?.modified
        ? `${activeFile.name} has unsaved changes`
        : "Ready";

  return (
    <footer className={styles.status}>
      {status}
    </footer>
  );
}
