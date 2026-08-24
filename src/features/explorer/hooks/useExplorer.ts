import { useContext } from "react";

import { ExplorerContext } from "../context/ExplorerContext";

export function useExplorer() {
  const context = useContext(ExplorerContext);

  if (!context) {
    throw new Error(
      "useExplorer must be used inside ExplorerProvider."
    );
  }

  return context;
}