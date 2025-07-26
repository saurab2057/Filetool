import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  
  // --- START: ADD THIS BLOCK TO FIX THE GOOGLE LOGIN ERROR ---
  server: {

    // allowedHosts: [
    //   'your-ngrok-or-other-host.com'
    // ],
  },

})