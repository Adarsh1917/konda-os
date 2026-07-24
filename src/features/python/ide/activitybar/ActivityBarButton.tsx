import type { ActivityItem } from "../../../../shared/types/workspace";

interface ActivityBarButtonProps {
  item: ActivityItem;
  active: boolean;
  collapsed: boolean;
  onClick: () => void;
}

export default function ActivityBarButton({
  item,
  active,
  collapsed,
  onClick,
}: ActivityBarButtonProps) {
  return (
    <button
      type="button"
      className={[
        "konda-activitybar-button",
        active
          ? "konda-activitybar-button-active"
          : "",
      ]
        .filter(Boolean)
        .join(" ")}
      title={item.tooltip}
      aria-label={item.label}
      aria-pressed={active}
      onClick={onClick}
    >
      <span
        className="konda-activitybar-indicator"
      />

      <span
        className="konda-activitybar-icon"
        aria-hidden="true"
      >
        {item.icon}
      </span>

      {!collapsed && (
        <span className="konda-activitybar-label">
          {item.label}
        </span>
      )}
    </button>
  );
}