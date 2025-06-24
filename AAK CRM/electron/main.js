import { app, BrowserWindow, ipcMain} from 'electron';
import path from 'path';
import { fileURLToPath } from 'url';
import { getAllKursants, addKursant, updateKursant, deleteKursant, searchKursants } from './database.js';

let mainWindow
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);


const isDev = !app.isPackaged;


function createWindow() {
  mainWindow = new BrowserWindow({
   width: 1200,
   height: 800,
   frame: false,
   webPreferences: {
      preload: path.join(__dirname, 'preload.ts'),
      nodeIntegration: true,
      contextIsolation: true
    }
  });

  if (isDev) {
    mainWindow.loadURL('http://localhost:5173');
  } else {
    mainWindow.loadFile(path.join(__dirname, '../dist/index.html'));
  }
  
  // IPC handlers
  ipcMain.handle('kursant:getAll', async () => {
    return await getAllKursants();
  });

  ipcMain.handle('kursant:add', async (_event, data) => {
    return await addKursant(data);
  });

  ipcMain.handle('kursant:update', async (_event, data) => {
    return await updateKursant(data);
  });

  ipcMain.handle('kursant:delete', async (_event, id) => {
    return await deleteKursant(id);
  });

  ipcMain.handle('kursant:search', async (_event, query) => {
    return await searchKursants(query);
  });



  ipcMain.on('window:minimize', () => {
    if (mainWindow) {
      mainWindow.minimize();
    }
  });
  ipcMain.on('window:maximize', () => {
    if (mainWindow.isMaximized()) {
      mainWindow.restore();
    } else {
      mainWindow.maximize();
    }
});

  ipcMain.on('window:close', () => {
    mainWindow.close();
});
}



app.whenReady().then(() => {
  createWindow();
});

