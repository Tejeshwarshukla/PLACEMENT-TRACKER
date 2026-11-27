import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// Frontend calls /api/... and Vite forwards it to the Express server
export default defineConfig({
  plugins: [react()],
  server: { proxy: { '/api': 'http://127.0.0.1:5000' } },
});
