import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// VITE_BASE lets the same code deploy to a sub-path (GitHub Pages: /Ap-study-path/)
// or to the root of its own domain (Render, Railway, Docker).
export default defineConfig({
  plugins: [react()],
  base: process.env.VITE_BASE || '/',
  server: {
    proxy: { '/api': 'http://localhost:3001' }
  }
})
