import "./Explorer.css";

import ExplorerNode from "./ExplorerNode";
import { useWorkspaceContext } from "../../context/WorkspaceContext";

export default function Explorer() {
  const { project } =
    useWorkspaceContext();

  if (
    !project ||
    project.length === 0
  ) {
    return (
      <div className="explorer">
        <div className="explorer-header">
          Explorer
        </div>

        <div className="explorer-empty">
          No folder opened.
        </div>
      </div>
    );
  }

  return (
    <div className="explorer">
      <div className="explorer-header">
        Explorer
      </div>

      <div className="explorer-body explorer-scrollbar">
        {project.map((node) => (
          <ExplorerNode
            key={node.id}
            node={node}
          />
        ))}
      </div>
    </div>
  );
}