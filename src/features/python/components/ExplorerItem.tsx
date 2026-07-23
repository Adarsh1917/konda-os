import { useState } from "react";
import type { FileNode } from "../types";

interface ExplorerItemProps {
  node: FileNode;
  level: number;
  selectedId: string | null;
  onSelect: (node: FileNode) => void;
  onContextMenu: (
    e: React.MouseEvent,
    node: FileNode
  ) => void;
}

export default function ExplorerItem({
  node,
  level,
  selectedId,
  onSelect,
  onContextMenu,
}: ExplorerItemProps) {
  const [expanded, setExpanded] = useState(
    node.expanded ?? false
  );

  const isFolder = node.type === "folder";
  const isSelected = selectedId === node.id;

  return (
    <>
      <div
        className={`flex items-center gap-2 px-3 py-2 cursor-pointer select-none transition-colors ${
          isSelected
            ? "bg-blue-600 text-white"
            : "hover:bg-zinc-800"
        }`}
        style={{
          paddingLeft: `${12 + level * 18}px`,
        }}
        onClick={() => {
          onSelect(node);

          if (isFolder) {
            setExpanded(!expanded);
          }
        }}
        onContextMenu={(e) =>
          onContextMenu(e, node)
        }
      >
        <span>
          {isFolder
            ? expanded
              ? "📂"
              : "📁"
            : "📄"}
        </span>

        <span>{node.name}</span>
      </div>

      {expanded &&
        isFolder &&
        node.children?.map((child) => (
          <ExplorerItem
            key={child.id}
            node={child}
            level={level + 1}
            selectedId={selectedId}
            onSelect={onSelect}
            onContextMenu={onContextMenu}
          />
        ))}
    </>
  );
}