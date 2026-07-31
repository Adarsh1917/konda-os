import TopBar from "../../components/top-bar/TopBar";
import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";
import styles from "./AppShell.module.css";

export default function AppShell() {
  return (
    <div className={styles.shell}>
      <TopBar />

      <div className={styles.content}>
        <ActivityBar />

        <Sidebar />

        <main className={styles.workspace}>
          <h1>🚀 Welcome to Konda OS</h1>
          <p>Main Workspace</p>
        </main>
      </div>

      <StatusBar />
    </div>
  );
}