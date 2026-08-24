import { EventType } from "./EventTypes";

export const KernelEvents = {
  SystemStarting:
    EventType.SYSTEM_STARTING,

  SystemStarted:
    EventType.SYSTEM_STARTED,

  SystemStopping:
    EventType.SYSTEM_STOPPING,

  SystemStopped:
    EventType.SYSTEM_STOPPED,

  UserMessage:
    EventType.USER_MESSAGE,

  AIRequest:
    EventType.AI_REQUEST,

  AIResponse:
    EventType.AI_RESPONSE,

  ToolRequest:
    EventType.TOOL_REQUEST,

  ToolResult:
    EventType.TOOL_RESULT,

  MemoryRead:
    EventType.MEMORY_READ,

  MemoryWrite:
    EventType.MEMORY_WRITE,

  ProjectOpened:
    EventType.PROJECT_OPENED,

  ProjectClosed:
    EventType.PROJECT_CLOSED,

  FileOpened:
    EventType.FILE_OPENED,

  FileSaved:
    EventType.FILE_SAVED,

  FileClosed:
    EventType.FILE_CLOSED,
} as const;