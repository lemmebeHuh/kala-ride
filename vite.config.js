import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    proxy: {
      '/api/beacon': {
        target: 'https://www.strava.com/beacon',
        changeOrigin: true,
        rewrite: (path) => path.replace(/^\/api\/beacon/, '')
      }
    }
  }
})
