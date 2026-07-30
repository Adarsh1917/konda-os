import { useState } from "react";
import type { FileNode } from "../../types";
import { useWorkspaceContext } from "../../context/WorkspaceContext";

interface ExplorerNodeProps {
  node: FileNode;
  level?: number;
}

export default function ExplorerNode({
  node,
  level = 0,
}: ExplorerNodeProps) {
  const {
    activeFile,
    openFile,
  } = useWorkspaceContext();

  const [expanded, setExpanded] =
    useState(
      node.expanded ?? true
    );

  const isDirectory =
    node.type === "directory";

  const handleClick = () => {
    if (isDirectory) {
      setExpanded(
        (value) => !value
      );
      return;
    }

    openFile(node);
  };

  return (
    <>
      <div
        className={`explorer-node ${
          activeFile?.id === node.id
            ? "active"
            : ""
        }`}
        style={{
          paddingLeft: `${
            level * 18 + 8
          }px`,
        }}
        onClick={handleClick}
      >
        <span className="explorer-node-icon">
          {isDirectory
            ? expanded
              ? "📂"
              : "📁"
            : "📄"}
        </span>

        <span className="explorer-node-name">
          {node.name}
        </span>
      </div>

      {isDirectory &&
        expanded &&
        node.children &&
        node.children.length >
          0 && (
          <div className="explorer-children">
            {node.children.map(
              (child) => (
                <ExplorerNode
                  key={child.id}
                  node={child}
                  level={
                    level + 1
                  }
                />
              )
            )}
          </div>
        )}
    </>
  );
}