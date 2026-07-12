import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  base: '/portal/',
  build: {
    outDir: '../public/portal',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/backend-api': {
        target: 'http://localhost:5000',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/backend-api/, '/api'),
      },
    },
  },
  // The portal uses frequently changing lazy-loaded pages. Offline precaching can
  // serve an old entry file after a deployment and leave users on a blank screen.
  plugins: [react()],
});
