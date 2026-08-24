export type KernelStatus =
  | "stopped"
  | "starting"
  | "running"
  | "stopping"
  | "error";

export type KernelEventPriority =
  | "low"
  | "normal"
  | "high"
  | "critical";

export interface KernelEvent<
  T = unknown,
> {
  id: string;

  type: string;

  timestamp: number;

  source: string;

  priority: KernelEventPriority;

  payload: T;
}

export interface KernelService {
  id: string;

  name: string;

  version: string;

  initialize(): Promise<void>;

  dispose(): Promise<void>;
}

export interface EventHandler<
  T = unknown,
> {
  (
    event: KernelEvent<T>
  ): void | Promise<void>;
}

export interface KernelModule {
  id: string;

  name: string;

  initialize(): Promise<void>;

  dispose(): Promise<void>;
}