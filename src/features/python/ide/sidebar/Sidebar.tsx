import "./Sidebar.css";

import Explorer from "../../components/Explorer";

import { useNavigation } from "../navigation/useNavigation";
import { useWorkspaceContext } from "../../context/WorkspaceContext";

export default function Sidebar() {
  const {
    activeView,
    collapsed,
  } = useNavigation();

  const {
    project,

    openFile,

    createFolder,
    createFile,

    renameItem,
    deleteItem,
  } = useWorkspaceContext();

  if (collapsed) {
    return null;
  }

  const renderContent = () => {
    switch (activeView) {
      case "explorer":
        return (
          <Explorer
            project={project}
            onOpenFile={openFile}
            createFolder={createFolder}
            createFile={createFile}
            renameItem={renameItem}
            deleteItem={deleteItem}
          />
        );

      case "search":
        return (
          <div className="konda-sidebar-placeholder">
            <h3>Search</h3>

            <p>
              Project-wide search will be added
              in Sprint 2.
            </p>
          </div>
        );

      case "source-control":
        return (
          <div className="konda-sidebar-placeholder">
            <h3>Source Control</h3>

            <p>
              Git integration arrives in Sprint
              3.
            </p>
          </div>
        );

      case "run":
        return (
          <div className="konda-sidebar-placeholder">
            <h3>Run & Debug</h3>

            <p>
              Debug tools will be available in
              Sprint 3.
            </p>
          </div>
        );

      case "extensions":
        return (
          <div className="konda-sidebar-placeholder">
            <h3>Extensions</h3>

            <p>
              Extension marketplace coming soon.
            </p>
          </div>
        );

      case "ai":
        return (
          <div className="konda-sidebar-placeholder">
            <h3>Konda AI</h3>

            <p>
              Your AI coding assistant will live
              here.
            </p>
          </div>
        );

      default:
        return null;
    }
  };

  const getTitle = () => {
    switch (activeView) {
      case "explorer":
        return "Explorer";

      case "search":
        return "Search";

      case "source-control":
        return "Source Control";

      case "run":
        return "Run & Debug";

      case "extensions":
        return "Extensions";

      case "ai":
        return "Konda AI";

      default:
        return "";
    }
  };

  return (
    <aside className="konda-sidebar">
      <header className="konda-sidebar-header">
        <span className="konda-sidebar-title">
          {getTitle()}
        </span>
      </header>

      <section className="konda-sidebar-content">
        {renderContent()}
      </section>
    </aside>
  );
}