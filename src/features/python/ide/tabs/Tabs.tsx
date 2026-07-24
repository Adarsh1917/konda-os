import "./Tabs.css";

import Tab from "./Tab";

import { useWorkspaceContext } from "../../context/WorkspaceContext";

export default function Tabs() {
  const {
    openTabs,
    activeTabId,
    selectTab,
    closeTab,
  } = useWorkspaceContext();

  if (openTabs.length === 0) {
    return (
      <div className="tabs-container tabs-empty">
        <span>No files open</span>
      </div>
    );
  }

  return (
    <div className="tabs-container">
      <div className="tabs-scroll">
        {openTabs.map((tab) => (
          <Tab
            key={tab.id}
            id={tab.id}
            name={tab.name}
            active={tab.id === activeTabId}
            onSelect={() => selectTab(tab.id)}
            onClose={() => closeTab(tab.id)}
          />
        ))}
      </div>
    </div>
  );
}