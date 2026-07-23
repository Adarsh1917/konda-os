interface ContextMenuProps {
  visible: boolean;
  x: number;
  y: number;
  onRename: () => void;
  onDelete: () => void;
  onClose: () => void;
}

export default function ContextMenu({
  visible,
  x,
  y,
  onRename,
  onDelete,
  onClose,
}: ContextMenuProps) {
  if (!visible) return null;

  return (
    <>
      <div
        className="fixed inset-0 z-40"
        onClick={onClose}
      />

      <div
        className="fixed z-50 w-44 rounded-md border border-zinc-700 bg-zinc-900 shadow-lg"
        style={{
          left: x,
          top: y,
        }}
      >
        <button
          className="w-full px-3 py-2 text-left hover:bg-zinc-800"
          onClick={() => {
            onRename();
            onClose();
          }}
        >
          ✏️ Rename
        </button>

        <button
          className="w-full px-3 py-2 text-left hover:bg-red-600"
          onClick={() => {
            onDelete();
            onClose();
          }}
        >
          🗑 Delete
        </button>
      </div>
    </>
  );
}