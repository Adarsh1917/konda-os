import {
  FolderOpen,
  Bot,
  Terminal,
  Settings,
} from "lucide-react";

import { useNavigation } from "../navigation";
import styles from "./ActivityBar.module.css";

export default function ActivityBar() {
  const { activeItem, setActiveItem } = useNavigation();

  return (
    <aside className={styles.bar}>
      <button
        className={activeItem === "explorer" ? styles.active : ""}
        onClick={() => setActiveItem("explorer")}
        title="Explorer"
      >
        <FolderOpen size={22} />
      </button>

      <button
        className={activeItem === "ai" ? styles.active : ""}
        onClick={() => setActiveItem("ai")}
        title="AI"
      >
        <Bot size={22} />
      </button>

      <button
        className={activeItem === "terminal" ? styles.active : ""}
        onClick={() => setActiveItem("terminal")}
        title="Terminal"
      >
        <Terminal size={22} />
      </button>

      <button
        className={activeItem === "settings" ? styles.active : ""}
        onClick={() => setActiveItem("settings")}
        title="Settings"
      >
        <Settings size={22} />
      </button>
    </aside>
  );
}