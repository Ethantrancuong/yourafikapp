import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

// PWA: manifest + service worker viết tay trong /public (xem docs/decisions.md D8)
export default defineConfig({
  plugins: [react()],
  build: { target: 'es2020' },
});
