import IDELayout from "./ide/layout/IDELayout";
import { RuntimeProvider } from "./runtime/RuntimeContext";

import {
  WorkspaceProvider,
} from "./context/WorkspaceContext";

import NavigationProvider from "./ide/navigation/NavigationProvider";

import { useWorkspace } from "./hooks/useWorkspace";

export default function PythonWorkspace() {
  const workspace = useWorkspace();

  return (
    <RuntimeProvider>
      <WorkspaceProvider value={workspace}>
        <NavigationProvider>
          <IDELayout />
        </NavigationProvider>
      </WorkspaceProvider>
    </RuntimeProvider>
  );
}