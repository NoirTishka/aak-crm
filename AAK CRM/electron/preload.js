const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('api', {
  getAllKursants: () => ipcRenderer.invoke('kursant:getAll'),
  addKursant: (data) => ipcRenderer.invoke('kursant:add', data),
  updateKursant: (data) => ipcRenderer.invoke('kursant:update', data),
  deleteKursant: (id) => ipcRenderer.invoke('kursant:delete', id),
  searchKursants: (query) => ipcRenderer.invoke('kursant:search', query),
  minimize: () => ipcRenderer.send('window:minimize'),
  maximize: () => ipcRenderer.send('window:maximize'),
  close: () => ipcRenderer.send('window:close'),
});
