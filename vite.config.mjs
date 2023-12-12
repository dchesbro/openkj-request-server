import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    outDir: '../express/public',
  },
  cacheDir: '../node_modules/.vite',
  plugins: [react()],
  root: 'vite',
});
