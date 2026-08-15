const { app, BrowserWindow, dialog, shell } = require("electron");
const path = require("path");
const https = require("https");

const UPDATE_FEED =
  "https://price-tamer-app.lovable.app/api/public/app-version";

function fetchJson(url) {
  return new Promise((resolve, reject) => {
    https
      .get(url, { headers: { accept: "application/json" } }, (res) => {
        let data = "";
        res.on("data", (c) => (data += c));
        res.on("end", () => {
          try {
            resolve(JSON.parse(data));
          } catch (e) {
            reject(e);
          }
        });
      })
      .on("error", reject);
  });
}

function isNewer(remote, current) {
  const a = String(remote).split(".").map(Number);
  const b = String(current).split(".").map(Number);
  for (let i = 0; i < 3; i++) {
    if ((a[i] || 0) > (b[i] || 0)) return true;
    if ((a[i] || 0) < (b[i] || 0)) return false;
  }
  return false;
}

async function checkForUpdates(win) {
  try {
    const info = await fetchJson(UPDATE_FEED);
    if (!info || !isNewer(info.version, app.getVersion())) return;
    const { response } = await dialog.showMessageBox(win, {
      type: "info",
      buttons: ["Pobierz teraz", "Później"],
      defaultId: 0,
      cancelId: 1,
      title: "Dostępna aktualizacja",
      message: `Nowa wersja ${info.version} jest dostępna.`,
      detail: info.notes || "",
    });
    if (response === 0 && info.downloadUrl) shell.openExternal(info.downloadUrl);
  } catch {
    // brak sieci — pomijamy
  }
}

function createWindow() {
  const win = new BrowserWindow({
    width: 1280,
    height: 860,
    backgroundColor: "#12181a",
    autoHideMenuBar: true,
    title: "SCUM · Skup Machety",
    webPreferences: {
      contextIsolation: true,
      nodeIntegration: false,
    },
  });

  win.loadFile(path.join(__dirname, "..", "dist-desktop", "index.html"));
  win.webContents.once("did-finish-load", () => {
    setTimeout(() => checkForUpdates(win), 2000);
  });
}

app.whenReady().then(() => {
  createWindow();
  app.on("activate", () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on("window-all-closed", () => {
  if (process.platform !== "darwin") app.quit();
});
