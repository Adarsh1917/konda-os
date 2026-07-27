import type { PythonInterpreter } from "./types";

declare global {
  interface Window {
    electronAPI?: {
      runtime?: {
        detectPython(): Promise<PythonInterpreter | null>;
      };
    };
  }
}

class PythonEnvironment {
  private interpreter: PythonInterpreter | null = null;

  async detect(): Promise<PythonInterpreter> {
    if (this.interpreter) {
      return this.interpreter;
    }

    const runtime = window.electronAPI?.runtime;

    if (!runtime?.detectPython) {
      this.interpreter = {
        executable: "python",
      };

      return this.interpreter;
    }

    const detected = await runtime.detectPython();

    if (detected) {
      this.interpreter = detected;
      return detected;
    }

    this.interpreter = {
      executable: "python",
    };

    return this.interpreter;
  }

  async executable(): Promise<string> {
    const python = await this.detect();
    return python.executable;
  }

  clear(): void {
    this.interpreter = null;
  }
}

export const pythonEnvironment = new PythonEnvironment();