export interface WorkflowStep {
  id: string;
  name: string;
  execute(): Promise<void>;
}

export interface Workflow {
  id: string;
  name: string;
  steps: WorkflowStep[];
}

export class WorkflowEngine {
  async execute(
    workflow: Workflow
  ): Promise<void> {
    for (const step of workflow.steps) {
      await step.execute();
    }
  }

  async executeStep(
    step: WorkflowStep
  ): Promise<void> {
    await step.execute();
  }

  getStepCount(
    workflow: Workflow
  ): number {
    return workflow.steps.length;
  }

  isEmpty(
    workflow: Workflow
  ): boolean {
    return workflow.steps.length === 0;
  }
}