import type {
  KernelService,
} from "../types";

export class ServiceRegistry {
  private readonly services =
    new Map<string, KernelService>();

  register(
    service: KernelService
  ): void {
    if (
      this.services.has(service.id)
    ) {
      throw new Error(
        `Service '${service.id}' is already registered.`
      );
    }

    this.services.set(
      service.id,
      service
    );
  }

  unregister(
    id: string
  ): boolean {
    return this.services.delete(id);
  }

  get<T extends KernelService>(
    id: string
  ): T | undefined {
    return this.services.get(
      id
    ) as T | undefined;
  }

  has(
    id: string
  ): boolean {
    return this.services.has(id);
  }

  getAll(): KernelService[] {
    return Array.from(
      this.services.values()
    );
  }

  clear(): void {
    this.services.clear();
  }
}