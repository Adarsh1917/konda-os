import IDELayout from "./ide/layout/IDELayout";

import {
  WorkspaceProvider,
} from "./context/WorkspaceContext";

import { NavigationProvider } from "./ide/navigation/NavigationProvider";

import { useWorkspace } from "../shared/hooks/useWorkspace";

export default function PythonWorkspace() {
  const workspace = useWorkspace();

  return (
    <WorkspaceProvider value={workspace}>
      <NavigationProvider>
        <IDELayout />
      </NavigationProvider>
    </WorkspaceProvider>
  );
}