import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import dotenv from 'dotenv';
dotenv.config();
const VITE_APP_URL = process.env.VITE_APP_URL;
export default defineConfig({
  plugins: [react()],
  server: {
    port: 3000,
    proxy: {
      '/api': {
        target: VITE_APP_URL,
        changeOrigin: true,
      }
    }
  }
})
