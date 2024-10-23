import { defineConfig } from 'vite';
import react from '@vitejs/plugin-react';

export default defineConfig({
  plugins: [react()],
  base: '/timeline-tool/',
  server: {
    host: true, // Expose to the network
    port: 3000, // Optional: specify a port
  },
});