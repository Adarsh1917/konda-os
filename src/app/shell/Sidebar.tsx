import { useNavigation } from "../navigation";
import styles from "./Sidebar.module.css";

import ExplorerHeader from "../../features/explorer/components/ExplorerHeader";
import ExplorerTree from "../../features/explorer/components/ExplorerTree";

export default function Sidebar() {
  const { activeItem } = useNavigation();

  return (
    <aside className={styles.sidebar}>
      {activeItem === "explorer" && (
        <div className={styles.section}>
          <ExplorerHeader />

          <ExplorerTree />
        </div>
      )}

      {activeItem === "ai" && (
        <div className={styles.section}>
          <h3 className={styles.title}>KONDA AI</h3>

          <div className={styles.item}>AI Chat</div>
          <div className={styles.item}>History</div>
          <div className={styles.item}>Models</div>
        </div>
      )}

      {activeItem === "terminal" && (
        <div className={styles.section}>
          <h3 className={styles.title}>TERMINAL</h3>

          <div className={styles.item}>PowerShell</div>
          <div className={styles.item}>Bash</div>
          <div className={styles.item}>Logs</div>
        </div>
      )}

      {activeItem === "settings" && (
        <div className={styles.section}>
          <h3 className={styles.title}>SETTINGS</h3>

          <div className={styles.item}>Appearance</div>
          <div className={styles.item}>Editor</div>
          <div className={styles.item}>About</div>
        </div>
      )}
    </aside>
  );
}
