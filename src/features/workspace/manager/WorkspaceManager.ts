import { EventBus } from "../../../core/kernel";
import { WorkspaceStore } from "../state";
import { WorkspaceEvents } from "./WorkspaceEvents";

import type {
  WorkspaceFile,
  WorkspaceProject,
  WorkspaceState,
} from "../types";

export class WorkspaceManager {
  private readonly store =
    new WorkspaceStore();

  private readonly bus =
    new EventBus();

  getState(): WorkspaceState {
    return this.store.getState();
  }

  async openProject(
    project: WorkspaceProject
  ): Promise<void> {
    this.store.setProject(project);

    await this.bus.publish({
      id: crypto.randomUUID(),
      type:
        WorkspaceEvents.PROJECT_OPENED,
      timestamp: Date.now(),
      source: "workspace",
      priority: "normal",
      payload: project,
    });
  }

  async openFile(
    file: WorkspaceFile
  ): Promise<void> {
    const state =
      this.store.getState();

    if (
      !state.openFiles.some(
        f => f.path === file.path
      )
    ) {
      this.store.setOpenFiles([
        ...state.openFiles,
        file,
      ]);
    }

    this.store.setActiveFile(file);

    await this.bus.publish({
      id: crypto.randomUUID(),
      type:
        WorkspaceEvents.FILE_OPENED,
      timestamp: Date.now(),
      source: "workspace",
      priority: "normal",
      payload: file,
    });
  }

  async updateSelection(
    text: string
  ): Promise<void> {
    this.store.setSelectedText(text);

    await this.bus.publish({
      id: crypto.randomUUID(),
      type:
        WorkspaceEvents.SELECTION_CHANGED,
      timestamp: Date.now(),
      source: "workspace",
      priority: "low",
      payload: text,
    });
  }

  getEventBus(): EventBus {
    return this.bus;
  }

  reset(): void {
    this.store.reset();
  }
}