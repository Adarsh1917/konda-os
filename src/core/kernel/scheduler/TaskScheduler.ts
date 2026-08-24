export interface ScheduledTask {
  id: string;
  name: string;
  priority: number;
  execute(): Promise<void>;
}

export class TaskScheduler {
  private readonly queue: ScheduledTask[] = [];

  add(task: ScheduledTask): void {
    this.queue.push(task);

    this.queue.sort(
      (a, b) => b.priority - a.priority
    );
  }

  async runNext(): Promise<void> {
    const task = this.queue.shift();

    if (!task) {
      return;
    }

    await task.execute();
  }

  async runAll(): Promise<void> {
    while (this.queue.length > 0) {
      await this.runNext();
    }
  }

  clear(): void {
    this.queue.length = 0;
  }

  size(): number {
    return this.queue.length;
  }

  isEmpty(): boolean {
    return this.queue.length === 0;
  }
}