import { useState } from "react";
import ExplorerItem from "./ExplorerItem";
import ContextMenu from "../context-menu/ContextMenu";
import type { ExplorerNode } from "../../types/explorer";

const initialFiles: ExplorerNode[] = [
  {
    id: "1",
    name: "Project",
    type: "folder",
    expanded: true,
    children: [
      {
        id: "2",
        name: "main.py",
        type: "python",
      },
      {
        id: "3",
        name: "README.md",
        type: "markdown",
      },
    ],
  },
];

export default function Explorer() {
  const [files, setFiles] = useState<ExplorerNode[]>(initialFiles);

  const [selectedId, setSelectedId] = useState<string | null>(null);

  const [menuVisible, setMenuVisible] = useState(false);

  const [menuPosition, setMenuPosition] = useState({
    x: 0,
    y: 0,
  });

  const handleNewFile = () => {
    const newFile: ExplorerNode = {
      id: crypto.randomUUID(),
      name: "NewFile.py",
      type: "python",
    };

    setFiles((prev) => {
      const updated = [...prev];

      if (updated.length > 0 && updated[0].type === "folder") {
        updated[0] = {
          ...updated[0],
          children: [...(updated[0].children ?? []), newFile],
        };
      }

      return updated;
    });

    setMenuVisible(false);
  };

  const handleNewFolder = () => {
    const newFolder: ExplorerNode = {
      id: crypto.randomUUID(),
      name: "New Folder",
      type: "folder",
      expanded: true,
      children: [],
    };

    setFiles((prev) => {
      const updated = [...prev];

      if (updated.length > 0 && updated[0].type === "folder") {
        updated[0] = {
          ...updated[0],
          children: [...(updated[0].children ?? []), newFolder],
        };
      }

      return updated;
    });

    setMenuVisible(false);
  };

  return (
    <div
      className="w-64 h-full bg-zinc-900 text-white border-r border-zinc-800 overflow-auto"
      onContextMenu={(e) => {
        e.preventDefault();

        setMenuVisible(true);

        setMenuPosition({
          x: e.clientX,
          y: e.clientY,
        });
      }}
    >
      <div className="p-3 font-semibold border-b border-zinc-800">
        Explorer
      </div>

      {files.map((item) => (
        <ExplorerItem
          key={item.id}
          node={item}
          level={0}
          selectedId={selectedId}
          onSelect={setSelectedId}
        />
      ))}

      <ContextMenu
        x={menuPosition.x}
        y={menuPosition.y}
        visible={menuVisible}
        onClose={() => setMenuVisible(false)}
        onNewFile={handleNewFile}
        onNewFolder={handleNewFolder}
      />
    </div>
  );
}