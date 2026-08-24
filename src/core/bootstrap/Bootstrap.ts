import { BootstrapService } from "./BootstrapService";

class Bootstrap {
  private static instance: BootstrapService | undefined;

  private static initialization:
    | Promise<BootstrapService>
    | undefined;

  static async initialize(): Promise<BootstrapService> {
    if (Bootstrap.instance) {
      return Bootstrap.instance;
    }

    if (!Bootstrap.initialization) {
      Bootstrap.initialization = (async () => {
        const instance = new BootstrapService();

        try {
          await instance.initialize();
          Bootstrap.instance = instance;

          return instance;
        } finally {
          Bootstrap.initialization = undefined;
        }
      })();
    }

    return Bootstrap.initialization;
  }

  static getInstance(): BootstrapService {
    if (!Bootstrap.instance) {
      throw new Error(
        "Bootstrap has not been initialized."
      );
    }

    return Bootstrap.instance;
  }
}

export default Bootstrap;
