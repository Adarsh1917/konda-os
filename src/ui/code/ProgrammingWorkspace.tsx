import "./ProgrammingWorkspace.css";
import { useNavigate } from "react-router-dom";

const technologies = [
  "Python",
  "Java",
  "JavaScript",
  "TypeScript",
  "React",
  "C++",
];

const ProgrammingWorkspace = () => {
  const navigate = useNavigate();

  const openTechnology = (tech: string) => {
    if (tech === "Python") {
      navigate("/python");
    }
  };

  return (
    <div className="programming-workspace">
      <div className="programming-header">
        <div>
          <h1>💻 Programming Workspace</h1>
          <p>Write, build and learn with Konda AI</p>
        </div>

        <button className="new-project-btn">
          + New Project
        </button>
      </div>

      <div className="technology-grid">
        {technologies.map((tech) => (
          <div
            key={tech}
            className="technology-card"
            onClick={() => openTechnology(tech)}
          >
            <h3>{tech}</h3>
            <p>Open Workspace</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProgrammingWorkspace;