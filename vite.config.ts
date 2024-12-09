import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  server: {
    hmr: {
      overlay: false, // Disable the overlay to avoid the error message
    },
    mimeTypes: {
      '**/*.ts': 'application/javascript',
      '**/*.tsx': 'application/javascript',
      '**/*.js': 'application/javascript',
      '**/*.jsx': 'application/javascript',
      '**/*.css': 'text/css',
    },
  },
  optimizeDeps: {
    exclude: ['lucide-react'],
  },
});