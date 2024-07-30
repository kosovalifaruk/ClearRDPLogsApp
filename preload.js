const { contextBridge, ipcRenderer } = require("electron");

contextBridge.exposeInMainWorld("electronAPI", {
  clearRdpLogs: () => ipcRenderer.invoke("clear-rdp-logs"),
});
