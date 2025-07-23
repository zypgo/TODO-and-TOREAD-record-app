// preload.js
import { contextBridge, ipcRenderer } from 'electron';

// 在window对象上暴露API，以便渲染进程使用
contextBridge.exposeInMainWorld('electronAPI', {
  // 这里可以添加需要暴露给渲染进程的方法
  // 例如：
  // sendMessage: (message) => ipcRenderer.send('message', message),
  // onResponse: (callback) => ipcRenderer.on('response', callback)
});