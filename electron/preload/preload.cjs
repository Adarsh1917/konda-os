const {
  contextBridge,
  ipcRenderer,
} = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  runtime: {

    detectPython() {
      return ipcRenderer.invoke("runtime:detectPython");
    },

    runPython(request) {
      return ipcRenderer.invoke("runtime:run", request);
    },

    stopPython() {
      return ipcRenderer.invoke("runtime:stop");
    },

    onStdout(callback) {
      ipcRenderer.on("runtime:stdout", (_, text) => callback(text));
    },

    onStderr(callback) {
      ipcRenderer.on("runtime:stderr", (_, text) => callback(text));
    },

    onExit(callback) {
      ipcRenderer.on("runtime:exit", (_, code) => callback(code));
    },
  },
});