import { useContext } from "react";

import { RuntimeContext } from "./RuntimeContext";

export function useRuntime() {
  return useContext(RuntimeContext);
}