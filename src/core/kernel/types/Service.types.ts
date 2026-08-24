export interface IService {
  readonly id: string;

  readonly name: string;

  readonly version: string;

  initialize(): Promise<void>;

  dispose(): Promise<void>;
}