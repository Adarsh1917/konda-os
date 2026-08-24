import { EventBus } from "../bus";
import { ServiceRegistry } from "../registry";
import { EventType } from "../events";

import type {
  KernelService,
  KernelStatus,
  KernelEvent,
} from "../types";

export class KernelManager {
  private status: KernelStatus = "stopped";

  private readonly eventBus =
    new EventBus();

  private readonly registry =
    new ServiceRegistry();

  getStatus(): KernelStatus {
    return this.status;
  }

  getEventBus(): EventBus {
    return this.eventBus;
  }

  getRegistry(): ServiceRegistry {
    return this.registry;
  }

  registerService(
    service: KernelService
  ): void {
    this.registry.register(service);
  }

  async start(): Promise<void> {
    if (this.status !== "stopped") {
      return;
    }

    this.status = "starting";

    try {
      await this.publish(
        EventType.SYSTEM_STARTING
      );

      for (const service of this.registry.getAll()) {
        await service.initialize();
      }

      this.status = "running";

      await this.publish(
        EventType.SYSTEM_STARTED
      );
    } catch (error) {
      this.status = "error";
      throw error;
    }
  }

  async stop(): Promise<void> {
    if (this.status !== "running") {
      return;
    }

    this.status = "stopping";

    try {
      await this.publish(
        EventType.SYSTEM_STOPPING
      );

      const services =
        this.registry.getAll().reverse();

      for (const service of services) {
        await service.dispose();
      }

      this.status = "stopped";

      await this.publish(
        EventType.SYSTEM_STOPPED
      );
    } catch (error) {
      this.status = "error";
      throw error;
    }
  }

  private async publish(
    type: string
  ): Promise<void> {
    const event: KernelEvent = {
      id: crypto.randomUUID(),
      type,
      timestamp: Date.now(),
      source: "kernel",
      priority: "high",
      payload: {},
    };

    await this.eventBus.publish(event);
  }
}
