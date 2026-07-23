import { useEffect, useState } from "react";
import ExplorerItem from "./ExplorerItem";
import ContextMenu from "./ContextMenu";
import type { FileNode } from "../types";

interface ExplorerProps {
  project: FileNode[];
  onOpenFile: (node: FileNode) => void;

  createFolder: (
    parentId: string,
    folderName: string
  ) => void;

  createFile: (
    parentId: string,
    fileName: string
  ) => void;

  renameItem: (
    id: string,
    newName: string
  ) => void;

  deleteItem: (
    id: string
  ) => void;
}

export default function Explorer({
  project,
  onOpenFile,
  createFolder,
  createFile,
  renameItem,
  deleteItem,
}: ExplorerProps) {
  const [selectedNode, setSelectedNode] =
    useState<FileNode>(project[0]);

  const [menuVisible, setMenuVisible] =
    useState(false);

  const [menuPosition, setMenuPosition] =
    useState({
      x: 0,
      y: 0,
    });

  const handleSelect = (node: FileNode) => {
    setSelectedNode(node);

    if (node.type === "file") {
      onOpenFile(node);
    }
  };

  const handleContextMenu = (
    e: React.MouseEvent,
    node: FileNode
  ) => {
    e.preventDefault();

    setSelectedNode(node);

    setMenuPosition({
      x: e.clientX,
      y: e.clientY,
    });

    setMenuVisible(true);
  };

  const getTargetFolder = () => {
    return selectedNode.type === "folder"
      ? selectedNode.id
      : project[0].id;
  };

  const handleNewFolder = () => {
    const name = prompt("Folder name");

    if (!name?.trim()) return;

    createFolder(getTargetFolder(), name.trim());
  };

  const handleNewFile = () => {
    const name = prompt("File name");

    if (!name?.trim()) return;

    createFile(getTargetFolder(), name.trim());
  };

  const handleRename = () => {
    const name = prompt(
      "Rename",
      selectedNode.name
    );

    if (!name?.trim()) return;

    renameItem(selectedNode.id, name.trim());
  };

  useEffect(() => {
    const listener = (e: KeyboardEvent) => {
      if (e.key === "Delete") {
        deleteItem(selectedNode.id);
      }
    };

    window.addEventListener(
      "keydown",
      listener
    );

    return () =>
      window.removeEventListener(
        "keydown",
        listener
      );
  }, [selectedNode, deleteItem]);

  return (
    <aside className="h-full bg-zinc-900 text-white flex flex-col">
      <div className="flex items-center justify-between px-4 py-3 border-b border-zinc-800">
        <h2 className="text-sm font-semibold uppercase">
          Explorer
        </h2>

        <div className="flex gap-2">
          <button
            onClick={handleNewFile}
            className="hover:bg-zinc-700 rounded px-2 py-1"
          >
            📄
          </button>

          <button
            onClick={handleNewFolder}
            className="hover:bg-zinc-700 rounded px-2 py-1"
          >
            📁
          </button>

          <button
            onClick={handleRename}
            className="hover:bg-zinc-700 rounded px-2 py-1"
          >
            ✏️
          </button>
        </div>
      </div>

      <div className="flex-1 overflow-auto py-2">
        {project.map((node) => (
          <ExplorerItem
            key={node.id}
            node={node}
            level={0}
            selectedId={selectedNode.id}
            onSelect={handleSelect}
            onContextMenu={handleContextMenu}
          />
        ))}
      </div>

      <ContextMenu
        visible={menuVisible}
        x={menuPosition.x}
        y={menuPosition.y}
        onClose={() => setMenuVisible(false)}
        onRename={handleRename}
        onDelete={() => deleteItem(selectedNode.id)}
      />
    </aside>
  );
}