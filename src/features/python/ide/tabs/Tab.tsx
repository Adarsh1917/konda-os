import { X } from "lucide-react";

interface TabProps {
  id: string;
  name: string;
  active: boolean;
  dirty: boolean;
  onSelect: () => void;
  onClose: () => void;
}

export default function Tab({
  name,
  active,
  dirty,
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
          {dirty && (
            <span
              style={{
                color: "#ffb000",
                marginRight: 6,
                fontWeight: 700,
              }}
            >
              ●
            </span>
          )}

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