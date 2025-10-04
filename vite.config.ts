/// <reference types="node" />
import { fileURLToPath, URL } from 'node:url';

import tailwindcss from '@tailwindcss/vite';
import react from '@vitejs/plugin-react';
import { defineConfig } from 'vite';

export default defineConfig({
  plugins: [react(), tailwindcss()],
  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
    },
  },
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          react: ['react', 'react-dom'],
          dexie: ['dexie', 'dexie-react-hooks'],
          pdf: ['react-pdf'],
          ui: ['@radix-ui/react-dropdown-menu', '@radix-ui/react-slot'],
          utils: ['date-fns', 'nanoid', 'class-variance-authority', 'clsx'],
          icons: ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 1000,
  },
});
