export type RuntimeState =
  | "idle"
  | "starting"
  | "running"
  | "stopping"
  | "completed"
  | "error";

export type OutputType =
  | "stdout"
  | "stderr"
  | "system";

export interface RuntimeOutput {
  id: string;
  timestamp: number;
  type: OutputType;
  text: string;
}

export interface PythonExecutionRequest {
  filePath: string;
  workingDirectory: string;
  pythonPath?: string;
  args?: string[];
}

export interface PythonExecutionResult {
  success: boolean;
  exitCode: number | null;
}

export interface RuntimeContextValue {
  state: RuntimeState;

  /** True while a Python program is running */
  isRunning: boolean;

  /** Execution time in milliseconds */
  elapsed: number;

  currentFile: string | null;

  outputs: RuntimeOutput[];

  run: (request: PythonExecutionRequest) => Promise<void>;

  stop: () => Promise<void>;

  clear: () => void;

  addOutput: (
    type: OutputType,
    text: string
  ) => void;
}

export interface RuntimeProcess {
  id: string;
  pid?: number;
  filePath: string;
  startedAt: number;
}

export interface PythonInterpreter {
  executable: string;
  version?: string;
}