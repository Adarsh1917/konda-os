import type { OutputType, RuntimeOutput } from "./types";

type Listener = (output: RuntimeOutput) => void;

class TerminalService {
  private outputs: RuntimeOutput[] = [];
  private listeners = new Set<Listener>();

  subscribe(listener: Listener): () => void {
    this.listeners.add(listener);

    return () => {
      this.listeners.delete(listener);
    };
  }

  getOutputs(): RuntimeOutput[] {
    return [...this.outputs];
  }

  clear(): void {
    this.outputs = [];
    this.emit({
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type: "system",
      text: "Terminal cleared.",
    });
  }

  write(type: OutputType, text: string): void {
    const output: RuntimeOutput = {
      id: crypto.randomUUID(),
      timestamp: Date.now(),
      type,
      text,
    };

    this.outputs.push(output);
    this.emit(output);
  }

  system(text: string): void {
    this.write("system", text);
  }

  stdout(text: string): void {
    this.write("stdout", text);
  }

  stderr(text: string): void {
    this.write("stderr", text);
  }

  private emit(output: RuntimeOutput): void {
    for (const listener of this.listeners) {
      listener(output);
    }
  }
}

export const terminalService = new TerminalService();