import path from "path"
import tailwindcss from "@tailwindcss/vite"
import react from "@vitejs/plugin-react"
import { defineConfig } from 'vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 5173,
    // proxy: {
    //   '/api': {
    //     target: 'http://localhost:8080',
    //     changeOrigin: true,
    //     secure: false,
    //     // rewrite: (path) => path.replace(/^\/api/, '') // if you need to remove /api prefix
    //   }
    // }
  },
  resolve: {
    alias: {
      "@": path.resolve(__dirname, "./src"),
    },
  },
  
  // FIXED: Empty string for Spring Boot
  base: '',
  
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  
  // For development with proxy

})