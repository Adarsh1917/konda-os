import { useNavigation } from "../navigation";
import styles from "./Sidebar.module.css";

export default function Sidebar() {
  const { activeItem } = useNavigation();

  return (
    <aside className={styles.sidebar}>
      {activeItem === "explorer" && (
        <>
          <h3>Explorer</h3>
          <p>Konda OS</p>
          <p>src</p>
          <p>components</p>
        </>
      )}

      {activeItem === "ai" && (
        <>
          <h3>Konda AI</h3>
          <p>AI Chat</p>
          <p>History</p>
          <p>Models</p>
        </>
      )}

      {activeItem === "terminal" && (
        <>
          <h3>Terminal</h3>
          <p>PowerShell</p>
          <p>Bash</p>
          <p>Logs</p>
        </>
      )}

      {activeItem === "settings" && (
        <>
          <h3>Settings</h3>
          <p>Appearance</p>
          <p>Editor</p>
          <p>About</p>
        </>
      )}
    </aside>
  );
}