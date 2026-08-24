import TopBar from "../../components/top-bar/TopBar";

import ActivityBar from "./ActivityBar";
import Sidebar from "./Sidebar";
import StatusBar from "./StatusBar";

import styles from "./AppShell.module.css";

import { WorkspaceProvider } from "../../features/workspace/context/WorkspaceContext";
import EditorWorkspace from "../../features/workspace/components/EditorWorkspace";
import { ExplorerProvider } from "../../features/explorer/context/ExplorerContext";

export default function AppShell() {
  return (
    <WorkspaceProvider>
      <ExplorerProvider>
        <div className={styles.shell}>
          <TopBar />

          <div className={styles.content}>
            <ActivityBar />

            <Sidebar />

            <main className={styles.workspace}>
              <EditorWorkspace />
            </main>
          </div>

          <StatusBar />
        </div>
      </ExplorerProvider>
    </WorkspaceProvider>
  );
}
