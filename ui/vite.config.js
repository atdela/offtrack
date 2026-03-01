import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    outDir: 'dist',
    emptyOutDir: true,
  },
  server: {
    proxy: {
      '/graphql': 'http://127.0.0.1:8090',
      '/api': 'http://127.0.0.1:8090',
    },
  },
})
