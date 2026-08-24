export const EventType = {
  SYSTEM_STARTING: "system.starting",
  SYSTEM_STARTED: "system.started",

  SYSTEM_STOPPING: "system.stopping",
  SYSTEM_STOPPED: "system.stopped",

  USER_MESSAGE: "user.message",

  AI_REQUEST: "ai.request",
  AI_RESPONSE: "ai.response",

  TOOL_REQUEST: "tool.request",
  TOOL_RESULT: "tool.result",

  MEMORY_READ: "memory.read",
  MEMORY_WRITE: "memory.write",

  PROJECT_OPENED: "project.opened",
  PROJECT_CLOSED: "project.closed",

  FILE_OPENED: "file.opened",
  FILE_SAVED: "file.saved",
  FILE_CLOSED: "file.closed",
} as const;

export type EventType =
  (typeof EventType)[keyof typeof EventType];