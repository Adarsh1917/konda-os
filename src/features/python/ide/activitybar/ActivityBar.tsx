import "./ActivityBar.css";

import { ACTIVITY_ITEMS } from "../../../../shared/types/workspace";
import { useNavigation } from "../navigation/useNavigation";

import ActivityBarButton from "./ActivityBarButton";

export default function ActivityBar() {
  const {
    activeView,
    collapsed,
    setActiveView,
    toggleSidebar,
  } = useNavigation();

  return (
    <aside className="konda-activitybar">
      <div className="konda-activitybar-top">
        <button
          className="konda-activitybar-logo"
          title="Toggle Sidebar"
          onClick={toggleSidebar}
        >
          K
        </button>

        <div className="konda-activitybar-divider" />

        {ACTIVITY_ITEMS.map((item) => (
          <ActivityBarButton
            key={item.id}
            item={item}
            active={activeView === item.id}
            collapsed={collapsed}
            onClick={() =>
              setActiveView(item.id)
            }
          />
        ))}
      </div>

      <div className="konda-activitybar-bottom">
        <button
          className="konda-activitybar-settings"
          title="Settings"
        >
          ⚙
        </button>

        <button
          className="konda-activitybar-account"
          title="Account"
        >
          👤
        </button>
      </div>
    </aside>
  );
}