import type { ExplorerNode } from "../types/Explorer.types";

interface DirectoryEntry {
  name: string;
  isDirectory: boolean;
}

function joinPath(
  directory: string,
  name: string
): string {
  const separator = directory.includes("\\")
    ? "\\"
    : "/";

  return `${directory.replace(/[\\/]+$/, "")}${separator}${name}`;
}

function getDesktopApi() {
  if (!window.konda) {
    throw new Error(
      "Konda's desktop file APIs are unavailable. Start the app through Electron."
    );
  }

  return window.konda;
}

export async function readDirectory(
  path: string
): Promise<ExplorerNode[]> {
  const entries =
    (await getDesktopApi().readDirectory(
      path
    )) as DirectoryEntry[];

  return entries.map((entry) => ({
    id: joinPath(path, entry.name),

    name: entry.name,

    path: joinPath(path, entry.name),

    type: entry.isDirectory
      ? "folder"
      : "file",

    expanded: false,

    children: undefined,
  }));
}

export async function readFile(
  path: string
): Promise<string> {
  return getDesktopApi().readFile(path);
}

export function getProjectName(
  path: string
): string {
  const parts = path.split(/[\\/]/).filter(Boolean);

  return parts.at(-1) ?? path;
}
