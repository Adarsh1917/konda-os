import "./ProjectHeader.css";

interface ProjectHeaderProps {
  projectName: string;
  saved: boolean;
}

export default function ProjectHeader({
  projectName,
  saved,
}: ProjectHeaderProps) {
  return (
    <div className="project-header">
      <div className="project-info">
        <div className="project-title">
          📁 {projectName}
        </div>

        <div
          className={
            saved
              ? "project-status saved"
              : "project-status unsaved"
          }
        >
          {saved ? "● Saved" : "● Unsaved"}
        </div>
      </div>

      <div className="project-actions">
        <button>New Project</button>

        <button>Rename</button>

        <button>Save</button>
      </div>
    </div>
  );
}