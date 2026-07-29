import "./ProjectHeader.css";

import { useContext } from "react";
import { RuntimeContext } from "../../runtime/RuntimeContext";

export default function ProjectHeader() {
  const runtime = useContext(RuntimeContext);

  const formatTime = (ms: number) => {
    const seconds = (ms / 1000).toFixed(1);
    return `${seconds}s`;
  };

  return (
    <header className="project-header">
      <div className="project-header-left">
        <div className="project-title-group">
          <h1 className="project-title">
            Konda IDE
          </h1>

          <span className="project-subtitle">
            Professional Python Workspace
          </span>
        </div>
      </div>

      <div className="project-header-center">
        <span
          className={`runtime-badge ${
            runtime.isRunning
              ? "running"
              : "idle"
          }`}
        >
          {runtime.isRunning
            ? "Running"
            : "Ready"}
        </span>

        <span className="runtime-time">
          {formatTime(runtime.elapsed)}
        </span>
      </div>

      <div className="project-header-right">
        <button
          className="header-btn run-btn"
          disabled={runtime.isRunning}
          title="Run Python"
          onClick={() => {
            // Feature Pack 2:
            // Execute current file.
          }}
        >
          ▶ Run
        </button>

        <button
          className="header-btn stop-btn"
          disabled={!runtime.isRunning}
          title="Stop Execution"
          onClick={() => {
            void runtime.stop();
          }}
        >
          ■ Stop
        </button>

        <button
          className="header-btn clear-btn"
          title="Clear Terminal"
          onClick={() => {
            runtime.clear();
          }}
        >
          🧹 Clear
        </button>
      </div>
    </header>
  );
}