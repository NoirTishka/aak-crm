import { app, BrowserWindow, ipcMain, dialog } from "electron";
import path from "path";
import { fileURLToPath } from "url";
import {
  getAllKursants,
  addKursant,
  updateKursant,
  deleteKursant,
  searchKursants,
  saveKursantFiles,
  deleteKursantFile,
} from "./database.js";
import type { Kursant, FileKey } from "./types/kursant.js";
import * as fs from "fs";

let mainWindow: BrowserWindow;
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const attachmentsPath = path.join(app.getPath("userData"), "attachments");
if (!fs.existsSync(attachmentsPath)) {
  fs.mkdirSync(attachmentsPath, { recursive: true });
}

const isDev = !app.isPackaged;

function createWindow(): void {
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 800,
    frame: false,
    webPreferences: {
      preload: path.join(__dirname, "preload.js"),
      nodeIntegration: true,
      contextIsolation: true,
    },
  });

  if (isDev) {
    mainWindow.loadURL("http://localhost:5173");
  } else {
    mainWindow.loadFile(path.join(__dirname, "../dist/index.html"));
  }

  ipcMain.handle("kursant:getAll", async () => {
    return await getAllKursants();
  });

  ipcMain.handle("kursant:add", async (_event, data: Kursant) => {
    const newId = addKursant(data);
    return newId;
  });

  ipcMain.handle("kursant:update", async (_event, data: Kursant) => {
    return await updateKursant(data);
  });

  ipcMain.handle("kursant:delete", async (_event, id: number) => {
    return await deleteKursant(id);
  });

  ipcMain.handle("kursant:search", async (_event, query: string) => {
    return await searchKursants(query);
  });

  ipcMain.handle(
    "save-kursant-file",
    async (_event, id: number, key: FileKey) => {
      return await saveKursantFiles(id, key);
    }
  );

  ipcMain.handle(
    "file:deleteKursantFile",
    (_event, kursantId: number, key: FileKey) => {
      const success = deleteKursantFile(kursantId, key);
      return { success };
    }
  );

  ipcMain.handle("file:pick", async () => {
    const { canceled, filePaths } = await dialog.showOpenDialog({
      properties: ["openFile"],
    });
    if (canceled || filePaths.length === 0) return null;
    const filePath = filePaths[0];
    const fileName = path.basename(filePath);
    return {
      path: filePath,
      name: fileName,
    };
  });

  ipcMain.handle("file:read", async (_event, path: string) => {
    return new Promise<Uint8Array>((resolve, reject) => {
      fs.readFile(path, (err, data) => {
        if (err) reject(err);
        else resolve(new Uint8Array(data));
      });
    });
  });

  ipcMain.on("window:minimize", () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });

  ipcMain.on("window:maximize", () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
  });

  ipcMain.on("window:close", () => {
    mainWindow.close();
  });
}

app.whenReady().then(() => {
  createWindow();
});
