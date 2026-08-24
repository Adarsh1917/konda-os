import EditorTabs from "./EditorTabs";
import MonacoEditor from "./MonacoEditor";

import styles from "./EditorWorkspace.module.css";

export default function EditorWorkspace() {
  return (
    <div className={styles.workspace}>
      <EditorTabs />

      <div className={styles.editor}>
        <MonacoEditor />
      </div>
    </div>
  );
}