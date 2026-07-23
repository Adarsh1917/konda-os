import { useState } from "react";
import ExplorerItem from "./ExplorerItem";
import type { FileNode } from "./types";

interface ExplorerProps {
  project: FileNode[];
  onOpenFile: (node: FileNode) => void;
}

export default function Explorer({
  project,
  onOpenFile,
}: ExplorerProps) {
  const [selectedId, setSelectedId] = useState<string | null>(null);

  return (
    <aside className="explorer">
      <h3>Explorer</h3>

      {project.map((node) => (
        <ExplorerItem
          key={node.id}
          node={node}
          level={0}
          selectedId={selectedId}
          onSelect={(selectedNode) => {
            setSelectedId(selectedNode.id);

            if (selectedNode.type === "file") {
              onOpenFile(selectedNode);
            }
          }}
        />
      ))}
    </aside>
  );
}