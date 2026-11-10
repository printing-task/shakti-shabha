import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

export default defineConfig({
  base: '/',
  envPrefix: ['VITE_', 'SUPABASE_'],
  plugins: [react()],
  server: {
    port: 3000,
    strictPort: true,
    watch: {
      ignored: ['**/dist/**', '**/.git/**']
    }
  },
  resolve: {
    alias: { '@': path.resolve(__dirname, './src') }
  }
})
