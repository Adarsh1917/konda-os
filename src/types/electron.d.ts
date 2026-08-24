export {};

declare global {
  interface Window {
    konda: {
      readDirectory(
        path: string
      ): Promise<unknown>;

      readFile(
        path: string
      ): Promise<string>;

      writeFile(
        path: string,
        content: string
      ): Promise<boolean>;

      openProject(): Promise<
        string | null
      >;
    };
  }
}