const { ipcMain } = require("electron");
const fs = require("fs/promises");
const path = require("path");

let projectRoot = null;

function setProjectRoot(directory) {
  projectRoot = path.resolve(directory);
}

function resolveProjectPath(targetPath) {
  if (
    typeof targetPath !== "string" ||
    targetPath.trim().length === 0
  ) {
    throw new Error("A file path is required.");
  }

  if (!projectRoot) {
    throw new Error("Open a project before accessing its files.");
  }

  const resolvedPath = path.resolve(targetPath);
  const relativePath = path.relative(
    projectRoot,
    resolvedPath
  );

  const isInsideProject =
    relativePath === "" ||
    (!relativePath.startsWith(
      `..${path.sep}`
    ) &&
      relativePath !== ".." &&
      !path.isAbsolute(relativePath));

  if (!isInsideProject) {
    throw new Error(
      "The requested path is outside the open project."
    );
  }

  return resolvedPath;
}

function registerFilesystemIPC() {
  ipcMain.handle(
    "fs:readDirectory",
    async (_, directory) => {
      const entries = await fs.readdir(
        resolveProjectPath(directory),
        {
          withFileTypes: true,
        }
      );

      return entries
        .map((entry) => ({
          name: entry.name,
          isDirectory: entry.isDirectory(),
        }))
        .sort((left, right) => {
          if (
            left.isDirectory !==
            right.isDirectory
          ) {
            return left.isDirectory ? -1 : 1;
          }

          return left.name.localeCompare(
            right.name,
            undefined,
            { numeric: true }
          );
        });
    }
  );

  ipcMain.handle(
    "fs:readFile",
    async (_, file) => {
      return fs.readFile(
        resolveProjectPath(file),
        "utf8"
      );
    }
  );

  ipcMain.handle(
    "fs:writeFile",
    async (_, file, content) => {
      if (typeof content !== "string") {
        throw new Error("File content must be text.");
      }

      await fs.writeFile(
        resolveProjectPath(file),
        content,
        "utf8"
      );

      return true;
    }
  );
}

module.exports = {
  registerFilesystemIPC,
  setProjectRoot,
};
