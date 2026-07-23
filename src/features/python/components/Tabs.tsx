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
  return (
    <div className="flex bg-zinc-900 border-b border-zinc-700 overflow-x-auto">
      {tabs.map((tab) => (
        <div
          key={tab.id}
          onClick={() => onSelect(tab.id)}
          className={`flex items-center gap-2 px-4 py-2 cursor-pointer border-r border-zinc-700 ${
            activeTabId === tab.id
              ? "bg-zinc-800 text-white"
              : "bg-zinc-900 text-zinc-400 hover:bg-zinc-800"
          }`}
        >
          <span>{tab.name}</span>

          <button
            className="text-sm hover:text-red-500"
            onClick={(e) => {
              e.stopPropagation();
              onClose(tab.id);
            }}
          >
            ✕
          </button>
        </div>
      ))}
    </div>
  );
}