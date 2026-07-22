import { useEffect } from "react";

interface Props {
  x: number;
  y: number;
  visible: boolean;
  onClose: () => void;
  onNewFile: () => void;
  onNewFolder: () => void;
}

export default function ContextMenu({
  x,
  y,
  visible,
  onClose,
  onNewFile,
  onNewFolder,
}: Props) {
  useEffect(() => {
    const handleClick = () => {
      onClose();
    };

    if (visible) {
      window.addEventListener("click", handleClick);
    }

    return () => {
      window.removeEventListener("click", handleClick);
    };
  }, [visible, onClose]);

  if (!visible) return null;

  return (
    <div
      className="fixed bg-zinc-800 border border-zinc-700 rounded-md shadow-lg py-2 w-52 z-50"
      style={{
        left: x,
        top: y,
      }}
      onClick={(e) => e.stopPropagation()}
    >
      <button
        className="w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors"
        onClick={onNewFile}
      >
        📄 New File
      </button>

      <button
        className="w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors"
        onClick={onNewFolder}
      >
        📁 New Folder
      </button>

      <hr className="my-2 border-zinc-700" />

      <button
        className="w-full text-left px-4 py-2 hover:bg-zinc-700 transition-colors"
        onClick={() => {
          console.log("Rename");
          onClose();
        }}
      >
        ✏️ Rename
      </button>

      <button
        className="w-full text-left px-4 py-2 hover:bg-red-600 transition-colors"
        onClick={() => {
          console.log("Delete");
          onClose();
        }}
      >
        🗑 Delete
      </button>
    </div>
  );
}