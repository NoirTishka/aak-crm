import { contextBridge, ipcRenderer } from 'electron';
import type { Kursant } from './types/kursant';
import fs from 'fs/promises';

contextBridge.exposeInMainWorld('api', {
  getAllKursants: (): Promise<Kursant[]> => ipcRenderer.invoke('kursant:getAll'),
  addKursant: (data: Kursant): Promise<number> => ipcRenderer.invoke('kursant:add', data),
  updateKursant: (data: Kursant): Promise<void> => ipcRenderer.invoke('kursant:update', data),
  deleteKursant: (id: number): Promise<void> => ipcRenderer.invoke('kursant:delete', id),
  searchKursants: (query: string): Promise<Kursant[]> => ipcRenderer.invoke('kursant:search', query),
  pickLocalFile: (): Promise<File | null> => ipcRenderer.invoke('file:pick'),
  saveFileDialog: (kursantId: number): Promise<string | null> =>
  ipcRenderer.invoke('file:saveDialog', kursantId),
  saveKursantFile: (id: number, key: string) =>
    ipcRenderer.invoke('save-kursant-file', id, key),
  readFile: async (filePath: string): Promise<Uint8Array> => {
    return await fs.readFile(filePath);
  },
  minimize: (): void => ipcRenderer.send('window:minimize'),
  maximize: (): void => ipcRenderer.send('window:maximize'),
  close: (): void => ipcRenderer.send('window:close'),
});