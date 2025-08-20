const { app, BrowserWindow } = require("electron");
const path = require("path");

let mainWindow = null;

function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, "preload.js"),
    },
  });

  // 在開發環境中載入 Vite 開發伺服器
  if (process.env.NODE_ENV === "development") {
    // 等待開發伺服器準備好
    const loadURL = async () => {
      try {
        await mainWindow.loadURL("http://localhost:5173");
        // 開發時可以打開開發者工具
        mainWindow.webContents.openDevTools();
      } catch (e) {
        console.log("等待開發伺服器啟動...");
        setTimeout(loadURL, 1000);
      }
    };
    loadURL();
  } else {
    // 在生產環境中載入打包後的檔案
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  mainWindow.on("closed", () => {
    mainWindow = null;
  });
}

app.whenReady().then(createWindow);

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") {
    app.quit();
  }
});

app.on("activate", () => {
  if (mainWindow === null) {
    createWindow();
  }
});
