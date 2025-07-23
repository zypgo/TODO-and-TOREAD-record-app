import { defineConfig } from 'vite';
import { resolve } from 'path';

export default defineConfig({
  main: {
    build: {
      rollupOptions: {
        input: {
          main: resolve(__dirname, 'main.js'),
        },
      },
    },
  },
  preload: {
    build: {
      rollupOptions: {
        input: {
          preload: resolve(__dirname, 'preload.js'),
        },
      },
    },
  },
});