import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';
import { VitePWA } from 'vite-plugin-pwa';

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
  plugins: [
    react(),
    VitePWA({
      registerType: 'autoUpdate',
      includeAssets: ['favicon.svg', 'apple-touch-icon.png'],
      manifest: {
        name: 'Divisha Makeovers',
        short_name: 'Divisha',
        description: 'Premium beauty salon booking - Bridal, Party & HD Makeup',
        theme_color: '#b76e79',
        background_color: '#fff5f7',
        display: 'standalone',
        orientation: 'portrait',
        scope: '/portal/',
        start_url: '/portal/divisha',
        icons: [
          {
            src: 'pwa-192x192.png',
            sizes: '192x192',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
          },
          {
            src: 'pwa-512x512.png',
            sizes: '512x512',
            type: 'image/png',
            purpose: 'any maskable',
          },
        ],
      },
      workbox: {
        globPatterns: ['**/*.{js,css,html,ico,png,svg,woff2}'],
        runtimeCaching: [
          {
            urlPattern: /^https:\/\/fonts\.googleapis\.com\/.*/i,
            handler: 'CacheFirst',
            options: {
              cacheName: 'google-fonts-cache',
              expiration: { maxEntries: 10, maxAgeSeconds: 60 * 60 * 24 * 365 },
            },
          },
        ],
      },
    }),
  ],
  //build: {
    //rollupOptions: {
      //output: {
        //manualChunks: {
          //vendor: ['react', 'react-dom', 'react-router-dom'],
          //redux: ['@reduxjs/toolkit', 'react-redux'],
        //},
      //},
    //},
  //},
});
