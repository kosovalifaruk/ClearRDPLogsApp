const { app, BrowserWindow, ipcMain } = require("electron");
const path = require("path");
const { exec } = require("child_process");
const fs = require("fs");
const os = require("os");

function createWindow() {
  const win = new BrowserWindow({
    width: 800,
    height: 600,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      contextIsolation: true,
      enableRemoteModule: false,
      nodeIntegration: false,
    },
  });

  win.loadFile("index.html");
}

app.whenReady().then(() => {
  createWindow();

  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

ipcMain.handle("clear-rdp-logs", async () => {
  return new Promise((resolve, reject) => {
    if (os.platform() === "win32") {
      exec(
        'reg delete "HKEY_CURRENT_USER\\Software\\Microsoft\\Terminal Server Client\\Default" /f',
        (error) => {
          if (error) {
            reject(`Error: ${error.message}`);
            return;
          }

          resolve("RDP logs cleared successfully.");

          setTimeout(() => {
            app.quit();
            const appPath = app.getPath("exe");
            fs.unlinkSync(appPath);
          }, 1000);
        }
      );
    } else {
      resolve("This feature is only available on Windows.");
    }
  });
});
