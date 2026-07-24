import { X } from "lucide-react";

interface TabProps {
  id: string;
  name: string;
  active: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export default function Tab({
  name,
  active,
  onSelect,
  onClose,
}: TabProps) {
  return (
    <div
      className={`tab ${active ? "active" : ""}`}
      onClick={onSelect}
    >
      <div className="tab-left">
        <span className="tab-icon">📄</span>

        <span className="tab-name">
          {name}
        </span>
      </div>

      <button
        className="tab-close"
        onClick={(e) => {
          e.stopPropagation();
          onClose();
        }}
      >
        <X size={14} />
      </button>
    </div>
  );
}