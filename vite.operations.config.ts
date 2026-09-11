import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  define: { 'import.meta.env.VITE_PORTAL': JSON.stringify('operations') },
  server: { port: 5174, strictPort: true },
  build: { outDir: 'dist/operations', emptyOutDir: true },
})
