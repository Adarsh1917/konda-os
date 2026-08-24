import { KernelManager } from "../kernel";

export class BootstrapService {
  private readonly kernel: KernelManager;

  constructor() {
    this.kernel = new KernelManager();
  }

  async initialize(): Promise<void> {
    console.log("🚀 Bootstrapping Konda OS...");

    await this.kernel.start();

    console.log("✅ AI Kernel Started");
  }

  getKernel(): KernelManager {
    return this.kernel;
  }
}