import {
  createContext,
  useEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";

import { pythonRunner } from "./PythonRunner";
import { terminalService } from "./TerminalService";

import type {
  RuntimeContextValue,
  RuntimeOutput,
  RuntimeState,
  PythonExecutionRequest,
  OutputType,
} from "./types";

export const RuntimeContext =
  createContext({} as RuntimeContextValue);

interface Props {
  children: ReactNode;
}

export function RuntimeProvider({
  children,
}: Props) {
  const [state, setState] =
    useState<RuntimeState>("idle");

  const [outputs, setOutputs] =
    useState<RuntimeOutput[]>([]);

  const [elapsed, setElapsed] =
    useState(0);

  const startTime =
    useRef<number | null>(null);

  useEffect(() => {
    const unsubscribe =
      terminalService.subscribe((output) => {
        setOutputs((prev) => [
          ...prev,
          output,
        ]);
      });

    return unsubscribe;
  }, []);

  useEffect(() => {
    if (state !== "running") return;

    const timer = setInterval(() => {
      if (startTime.current !== null) {
        setElapsed(
          Date.now() - startTime.current
        );
      }
    }, 100);

    return () => clearInterval(timer);
  }, [state]);

  const value: RuntimeContextValue =
    useMemo(
      () => ({
        state,

        currentFile: null,

        outputs,

        elapsed,

        isRunning:
          state === "running",

        async run(
          request: PythonExecutionRequest
        ): Promise<void> {
          startTime.current =
            Date.now();

          setElapsed(0);

          setOutputs([]);

          terminalService.clear();

          setState("running");

          try {
            await pythonRunner.run(
              request
            );
          } finally {
            setState("idle");
          }
        },

        async stop(): Promise<void> {
          await pythonRunner.stop();

          setState("idle");
        },

        clear(): void {
          setOutputs([]);

          terminalService.clear();
        },

        addOutput(
          type: OutputType,
          text: string
        ): void {
          terminalService.write(
            type,
            text
          );
        },
      }),
      [state, outputs, elapsed]
    );

  return (
    <RuntimeContext.Provider
      value={value}
    >
      {children}
    </RuntimeContext.Provider>
  );
}