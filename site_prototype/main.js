//https://medium.com/@vipinnation/how-to-convert-your-react-app-into-a-desktop-app-59bf0d2f5f8b

const { app, BrowserWindow } = require("electron");
const path = require("path")

let mainWindow;

function createWindow() {
    mainWindow = new BrowserWindow({
        width: 600,
        height: 600,
        webPreferences: {
            preload: path.join(__dirname, "preload.js"),
            nodeIntegration: true
        }
    });
    mainWindow.loadURL("http://localhost:5173");
    mainWindow.on("closed", () => {mainWindow = null})
}
app.on("ready", createWindow);
app.on("window-all-closed", () => {
    if (mainWindow == null) {
        createWindow();
    }
})