import { contextBridge, ipcRenderer } from 'electron';
import type { Kursant } from '../src/types/kursant';

contextBridge.exposeInMainWorld('api', {
  getAllKursants: (): Promise<Kursant[]> => ipcRenderer.invoke('kursant:getAll'),
  addKursant: (data: Kursant): Promise<void> => ipcRenderer.invoke('kursant:add', data),
  updateKursant: (data: Kursant): Promise<void> => ipcRenderer.invoke('kursant:update', data),
  deleteKursant: (id: number): Promise<void> => ipcRenderer.invoke('kursant:delete', id),
  searchKursants: (query: string): Promise<Kursant[]> => ipcRenderer.invoke('kursant:search', query),
  minimize: (): void => ipcRenderer.send('window:minimize'),
  maximize: (): void => ipcRenderer.send('window:maximize'),
  close: (): void => ipcRenderer.send('window:close'),
});