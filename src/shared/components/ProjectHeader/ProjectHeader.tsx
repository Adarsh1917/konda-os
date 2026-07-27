import "./ProjectHeader.css";

import {
  Play,
  Square,
} from "lucide-react";

import { useEffect } from "react";

import { useRuntime } from "../../../features/python/runtime/useRuntime";
import { useWorkspace } from "../../../features/python/hooks/useWorkspace";

export default function ProjectHeader() {

  const runtime =
    useRuntime();

  const {
    activeFile,
  } = useWorkspace();

  async function run() {

    if (!activeFile) return;

    await runtime.run({

      filePath:
        activeFile.path,

      workingDirectory:
        activeFile.directory,

    });

  }

  async function stop() {
    await runtime.stop();
  }

  useEffect(() => {

    function onKeyDown(e: KeyboardEvent) {

      if (e.key === "F5") {

        e.preventDefault();

        run();

      }

      if (
        e.ctrlKey &&
        e.shiftKey &&
        e.key === "F5"
      ) {

        e.preventDefault();

        stop();

      }

    }

    window.addEventListener(
      "keydown",
      onKeyDown
    );

    return () => {

      window.removeEventListener(
        "keydown",
        onKeyDown
      );

    };

  });

  return (

    <header className="project-header">

      <button
        onClick={run}
        disabled={runtime.isRunning}
      >
        <Play size={18}/>
        Run
      </button>

      <button
        onClick={stop}
        disabled={!runtime.isRunning}
      >
        <Square size={18}/>
        Stop
      </button>

      <div>

        {runtime.isRunning
          ? "Running..."
          : "Idle"}

      </div>

      <div>

        {(runtime.elapsed/1000).toFixed(1)}s

      </div>

    </header>

  );

}