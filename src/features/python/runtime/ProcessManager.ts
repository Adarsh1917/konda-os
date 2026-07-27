import type { RuntimeProcess } from "./types";

class ProcessManager {
  private current: RuntimeProcess | null = null;

  getCurrent(): RuntimeProcess | null {
    return this.current;
  }

  hasRunningProcess(): boolean {
    return this.current !== null;
  }

  start(filePath: string, pid?: number): RuntimeProcess {
    const process: RuntimeProcess = {
      id: crypto.randomUUID(),
      pid,
      filePath,
      startedAt: Date.now(),
    };

    this.current = process;

    return process;
  }

  stop(): void {
    this.current = null;
  }
}

export const processManager = new ProcessManager();