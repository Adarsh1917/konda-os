import ExplorerItem from "./ExplorerItem";
import { useExplorer } from "../hooks/useExplorer";

export default function ExplorerTree() {
  const {
    error,
    isLoading,
    openProject,
    tree,
  } = useExplorer();

  if (tree.length === 0) {
    return (
      <div
        style={{
          display: "flex",
          flexDirection: "column",
          gap: 10,
          padding: 16,
        }}
      >
        <span>
          {error ??
            (isLoading
              ? "Opening project…"
              : "Open a folder to start exploring.")}
        </span>

        <button
          onClick={() => void openProject()}
          type="button"
        >
          Open Folder
        </button>
      </div>
    );
  }

  return (
    <div
      style={{
        display: "flex",
        flexDirection: "column",
        gap: 2,
      }}
    >
      {error && (
        <div role="alert" style={{ padding: "0 12px" }}>
          {error}
        </div>
      )}

      {tree.map((node) => (
        <ExplorerItem
          key={node.id}
          node={node}
        />
      ))}
    </div>
  );
}
