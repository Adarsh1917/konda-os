import { processManager } from "./ProcessManager";
import { pythonEnvironment } from "./PythonEnvironment";
import { terminalService } from "./TerminalService";
import type {
  PythonExecutionRequest,
  PythonExecutionResult,
} from "./types";

declare global {
  interface Window {
    electronAPI?: {
      runtime?: {
        runPython(
          request: PythonExecutionRequest
        ): Promise<PythonExecutionResult>;

        stopPython(): Promise<void>;

        onStdout(
          callback: (text: string) => void
        ): void;

        onStderr(
          callback: (text: string) => void
        ): void;

        onExit(
          callback: (code: number | null) => void
        ): void;
      };
    }
  }
}

class PythonRunner {
  async run(
    request: PythonExecutionRequest
  ): Promise<void> {

    const runtime = window.electronAPI?.runtime;

    if (!runtime) {
      terminalService.stderr(
        "Electron runtime is unavailable."
      );
      return;
    }

    const interpreter =
      await pythonEnvironment.executable();

    processManager.start(request.filePath);

    terminalService.system(
      `Running ${request.filePath}`
    );

    runtime.onStdout((text) => {
      terminalService.stdout(text);
    });

    runtime.onStderr((text) => {
      terminalService.stderr(text);
    });

    runtime.onExit((code) => {
      terminalService.system(
        `Process exited with code ${code}`
      );

      processManager.stop();
    });

    await runtime.runPython({
      ...request,
      pythonPath: interpreter,
    });
  }

  async stop(): Promise<void> {

    processManager.stop();

    terminalService.system(
      "Execution stopped."
    );

    await window.electronAPI?.runtime?.stopPython();
  }
}

export const pythonRunner =
  new PythonRunner();