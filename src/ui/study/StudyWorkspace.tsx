import "./StudyWorkspace.css";
import { useNavigate } from "react-router-dom";

const subjects = [
  "Mathematics",
  "Physics",
  "Chemistry",
  "Programming",
];

const StudyWorkspace = () => {
  const navigate = useNavigate();

  const openSubject = (subject: string) => {
    if (subject === "Programming") {
      navigate("/programming");
    }
  };

  return (
    <div className="study-workspace">
      <div className="study-header">
        <div>
          <h1>📚 Study Workspace</h1>
          <p>Learn smarter with Konda AI</p>
        </div>

        <button className="new-subject-btn">
          + New Subject
        </button>
      </div>

      <div className="subjects-grid">
        {subjects.map((subject) => (
          <div
            key={subject}
            className="subject-card"
            onClick={() => openSubject(subject)}
          >
            <h3>{subject}</h3>
            <p>Open subject</p>
          </div>
        ))}
      </div>
    </div>
  );
};

export default StudyWorkspace;