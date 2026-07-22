import { useState } from "react";
import type { ExplorerNode } from "../../types/explorer";

interface Props {
  node: ExplorerNode;
  level: number;
  selectedId: string | null;
  onSelect: (id: string) => void;
}

export default function ExplorerItem({
  node,
  level,
  selectedId,
  onSelect,
}: Props) {
  const [expanded, setExpanded] = useState(node.expanded ?? false);

  const paddingLeft = 12 + level * 18;

  const getIcon = () => {
    switch (node.type) {
      case "folder":
        return expanded ? "📂" : "📁";
      case "python":
        return "🐍";
      case "java":
        return "☕";
      case "cpp":
        return "⚙️";
      case "javascript":
        return "🟨";
      case "typescript":
        return "🔷";
      case "markdown":
        return "📝";
      case "json":
        return "🧩";
      default:
        return "📄";
    }
  };

  const isSelected = selectedId === node.id;

  return (
    <>
      <div
        style={{ paddingLeft }}
        className={`flex items-center gap-2 py-2 px-2 cursor-pointer select-none transition-colors ${
          isSelected ? "bg-blue-600 text-white" : "hover:bg-zinc-800"
        }`}
        onClick={() => {
          onSelect(node.id);

          if (node.type === "folder") {
            setExpanded(!expanded);
          }
        }}
      >
        <span>{getIcon()}</span>
        <span>{node.name}</span>
      </div>

      {expanded &&
      node.children?.map((child: ExplorerNode) => (
          <ExplorerItem
            key={child.id}
            node={child}
            level={level + 1}
            selectedId={selectedId}
            onSelect={onSelect}
          />
        ))}
    </>
  );
}