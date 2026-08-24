import type { IService } from "../types/Service.types";

export class ServiceContainer {
  private readonly services =
    new Map<string, IService>();

  register(
    service: IService
  ): void {
    if (this.services.has(service.id)) {
      throw new Error(
        `Service '${service.id}' already exists.`
      );
    }

    this.services.set(
      service.id,
      service
    );
  }

  resolve<T extends IService>(
    id: string
  ): T {
    const service =
      this.services.get(id);

    if (!service) {
      throw new Error(
        `Service '${id}' not found.`
      );
    }

    return service as T;
  }

  has(
    id: string
  ): boolean {
    return this.services.has(id);
  }

  remove(
    id: string
  ): boolean {
    return this.services.delete(id);
  }

  clear(): void {
    this.services.clear();
  }

  getAll(): IService[] {
    return [
      ...this.services.values(),
    ];
  }
}