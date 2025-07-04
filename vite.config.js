import { defineConfig } from 'vite';

export default defineConfig({
  base: '/outline-generator/',
  build: {
    outDir: 'dist',
    assetsDir: 'assets',
    rollupOptions: {
      output: {
        manualChunks: undefined,
      },
    },
  },
});