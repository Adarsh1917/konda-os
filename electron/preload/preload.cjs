const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("konda", {
  readDirectory: (path) =>
    ipcRenderer.invoke("fs:readDirectory", path),

  readFile: (path) =>
    ipcRenderer.invoke("fs:readFile", path),

  writeFile: (path, content) =>
    ipcRenderer.invoke(
      "fs:writeFile",
      path,
      content
    ),

  openProject: () =>
    ipcRenderer.invoke("project:open"),
});