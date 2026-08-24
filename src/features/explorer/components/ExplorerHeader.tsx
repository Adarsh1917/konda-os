import {
  ChevronDown,
  FolderOpen,
  RefreshCw,
} from "lucide-react";

import { useExplorer } from "../hooks/useExplorer";

import styles from "./ExplorerHeader.module.css";

export default function ExplorerHeader() {
  const {
    isLoading,
    openProject,
    refresh,
    rootPath,
  } = useExplorer();

  return (
    <div className={styles.header}>
      <div className={styles.title}>
        <ChevronDown size={14} />
        <span>EXPLORER</span>
      </div>

      <div className={styles.actions}>
        <button
          className={styles.button}
          disabled={isLoading}
          onClick={() => void openProject()}
          title="Open Folder"
          type="button"
        >
          <FolderOpen size={15} />
        </button>

        <button
          className={styles.button}
          disabled={!rootPath || isLoading}
          onClick={() => void refresh()}
          title="Refresh Explorer"
          type="button"
        >
          <RefreshCw size={15} />
        </button>
      </div>
    </div>
  );
}
