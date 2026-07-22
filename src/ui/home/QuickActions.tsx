import "./QuickActions.css";

import {
  BookOpen,
  Code2,
  Brain,
  FolderOpen,
  Calendar,
  Rocket,
} from "lucide-react";

const actions = [
  {
    icon: BookOpen,
    title: "Study",
    description: "Learn with AI",
  },
  {
    icon: Code2,
    title: "Code",
    description: "Build projects",
  },
  {
    icon: Brain,
    title: "Memory",
    description: "Remember everything",
  },
  {
    icon: FolderOpen,
    title: "Files",
    description: "Manage documents",
  },
  {
    icon: Calendar,
    title: "Calendar",
    description: "Plan your day",
  },
  {
    icon: Rocket,
    title: "Projects",
    description: "Track your work",
  },
];

const QuickActions = () => {
  return (
    <section className="quick-actions">
      <h2>Quick Actions</h2>

      <div className="action-grid">
        {actions.map((action) => {
          const Icon = action.icon;

          return (
            <div className="action-card" key={action.title}>
              <div className="action-icon">
                <Icon size={34} />
              </div>

              <h3>{action.title}</h3>

              <p>{action.description}</p>
            </div>
          );
        })}
      </div>
    </section>
  );
};

export default QuickActions;