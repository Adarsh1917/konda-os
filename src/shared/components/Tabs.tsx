interface Tab {
  id: string;
  name: string;
}

interface TabsProps {
  tabs: Tab[];
  activeTabId: string | null;
  onSelect: (id: string) => void;
  onClose: (id: string) => void;
}

export default function Tabs({
  tabs,
  activeTabId,
  onSelect,
  onClose,
}: TabsProps) {
  if (tabs.length === 0) {
    return (
      <div className="h-10 flex items-center px-4 bg-zinc-900 border-b border-zinc-800 text-zinc-500 text-sm">
        No file opened
      </div>
    );
  }

  return (
    <div className="flex h-10 bg-zinc-900 border-b border-zinc-800 overflow-x-auto">
      {tabs.map((tab) => {
        const active = activeTabId === tab.id;

        return (
          <div
            key={tab.id}
            onClick={() => onSelect(tab.id)}
            className={`group flex items-center gap-2 px-4 border-r border-zinc-800 cursor-pointer transition-colors whitespace-nowrap ${
              active
                ? "bg-zinc-800 text-white"
                : "bg-zinc-900 text-zinc-400 hover:bg-zinc-850 hover:text-white"
            }`}
          >
            {/* Future: unsaved indicator */}
            <span className="text-xs">🐍</span>

            <span className="text-sm">{tab.name}</span>

            <button
              onClick={(e) => {
                e.stopPropagation();
                onClose(tab.id);
              }}
              className="ml-2 rounded px-1 text-zinc-500 hover:text-red-400 hover:bg-zinc-700 transition-colors"
              title="Close"
            >
              ✕
            </button>
          </div>
        );
      })}
    </div>
  );
}