const { ipcMain } = require("electron");

const {
  runPython,
  stopPython,
} = require("./python.cjs");

function registerRuntimeIPC(browserWindow) {
  ipcMain.handle(
    "runtime:run",
    async (_, request) => {

      return runPython(request, {
        stdout(text) {
          browserWindow.webContents.send(
            "runtime:stdout",
            text
          );
        },

        stderr(text) {
          browserWindow.webContents.send(
            "runtime:stderr",
            text
          );
        },

        exit(code) {
          browserWindow.webContents.send(
            "runtime:exit",
            code
          );
        },
      });
    }
  );

  ipcMain.handle(
    "runtime:stop",
    async () => {
      stopPython();
    }
  );
}

module.exports = {
  registerRuntimeIPC,
};
const {
  detectPython,
  runPython,
  stopPython,
} = require("./python.cjs");

ipcMain.handle(
  "runtime:detectPython",
  async () => {
    return detectPython();
  }
);