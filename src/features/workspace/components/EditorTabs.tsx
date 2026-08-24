import EditorTab from "./EditorTab";

import { useWorkspace } from "../hooks/useWorkspace";

import styles from "./EditorTabs.module.css";

export default function EditorTabs() {
  const { files } = useWorkspace();

  return (
    <div className={styles.tabs}>
      {files.map((file) => (
        <EditorTab
          key={file.id}
          file={file}
        />
      ))}
    </div>
  );
}