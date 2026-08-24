import { ChevronDown, ChevronRight, Folder } from "lucide-react";
import clsx from "clsx";

import type { ExplorerNode } from "../types/Explorer.types";
import { useExplorer } from "../hooks/useExplorer";
import { getFileIcon } from "../utils/getFileIcon";
import { readFile } from "../services/ExplorerService";

import { useWorkspace } from "../../workspace/hooks/useWorkspace";

import styles from "./ExplorerItem.module.css";

interface ExplorerItemProps {
  node: ExplorerNode;
  level?: number;
}

export default function ExplorerItem({
  node,
  level = 0,
}: ExplorerItemProps) {
  const {
    reportError,
    selected,
    selectNode,
    toggleFolder,
  } = useExplorer();

  const { openFile } = useWorkspace();

  const isFolder = node.type === "folder";

  const handleClick = async () => {
    selectNode(node.id);

    if (isFolder) {
      await toggleFolder(node.id);
      return;
    }

    try {
      const content = await readFile(node.path);

      openFile({
        id: node.id,
        name: node.name,
        path: node.path,
        language: "plaintext",
        modified: false,
        content,
      });
    } catch (error) {
      reportError(
        error instanceof Error
          ? error.message
          : `Unable to open ${node.name}.`
      );
    }
  };

  return (
    <>
      <div
        className={clsx(
          styles.item,
          selected === node.id && styles.selected
        )}
        onClick={() => void handleClick()}
        style={{
          paddingLeft: `${12 + level * 18}px`,
        }}
      >
        <div className={styles.chevron}>
          {isFolder ? (
            node.expanded ? (
              <ChevronDown size={16} />
            ) : (
              <ChevronRight size={16} />
            )
          ) : null}
        </div>

        <div className={styles.icon}>
          {isFolder ? (
            <Folder size={16} />
          ) : (
            getFileIcon({
              name: node.name,
            })
          )}
        </div>

        <span className={styles.label}>
          {node.name}
        </span>
      </div>

      {isFolder &&
        node.expanded && (
          <div className={styles.children}>
            {node.children?.map((child) => (
              <ExplorerItem
                key={child.id}
                node={child}
                level={level + 1}
              />
            ))}
          </div>
        )}
    </>
  );
}
