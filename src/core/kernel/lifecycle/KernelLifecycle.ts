import type { KernelStatus } from "../types";

export class KernelLifecycle {
  private status: KernelStatus = "stopped";

  getStatus(): KernelStatus {
    return this.status;
  }

  isRunning(): boolean {
    return this.status === "running";
  }

  isStopped(): boolean {
    return this.status === "stopped";
  }

  setStatus(status: KernelStatus): void {
    this.status = status;
  }

  canStart(): boolean {
    return this.status === "stopped";
  }

  canStop(): boolean {
    return this.status === "running";
  }

  reset(): void {
    this.status = "stopped";
  }
}