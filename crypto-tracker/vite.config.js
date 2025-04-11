import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// Get environment variables
const isProduction = process.env.NODE_ENV === 'production'
const apiTarget = isProduction 
  ? 'https://crypto-app-backend-izkoy.ondigitalocean.app'
  : 'http://localhost:5000'

export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    host: true,
    proxy: {
      '/api': {
        target: apiTarget,
        changeOrigin: true,
        secure: false
      }
    }
  },
  resolve: {
    extensions: ['.js', '.jsx']
  }
})
