import type {
  AIRequest,
} from "../types/AI.types";

export function chooseModel(
  request: AIRequest
) {
  const prompt =
    request.prompt.toLowerCase();

  if (
    prompt.includes("code") ||
    prompt.includes("react") ||
    prompt.includes("typescript")
  ) {
    return "qwen-coder";
  }

  if (
    prompt.includes("math") ||
    prompt.includes("solve")
  ) {
    return "deepseek-r1";
  }

  return "odysseus";
}