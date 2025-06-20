const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getAllKursants: () => ipcRenderer.invoke('kursant:getAll'),
  addKursant: (data) => ipcRenderer.invoke('kursant:add', data),
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
});
