const {
  BrowserWindow,
  dialog,
  ipcMain,
} = require("electron");

const {
  setProjectRoot,
} = require("./filesystem.cjs");

function registerProjectIPC() {
  ipcMain.handle("project:open", async (event) => {
    const browserWindow =
      BrowserWindow.fromWebContents(
        event.sender
      );

    const options = {
      properties: ["openDirectory"],
    };

    const result = browserWindow
      ? await dialog.showOpenDialog(
          browserWindow,
          options
        )
      : await dialog.showOpenDialog(options);

    if (
      result.canceled ||
      result.filePaths.length === 0
    ) {
      return null;
    }

    const projectRoot = result.filePaths[0];

    setProjectRoot(projectRoot);

    return projectRoot;
  });
}

module.exports = {
  registerProjectIPC,
};
