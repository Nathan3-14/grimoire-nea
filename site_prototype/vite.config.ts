import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  define: {
    "process.env": {} // or {'process.env.NODE_ENV': '"production"'}
  },
  plugins: [react()],
  optimizeDeps: {
    include: ["konva", "react-konva"]
  }
})
