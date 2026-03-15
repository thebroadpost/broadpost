import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vite.dev/config/
export default defineConfig({
  plugins: [react()],
  build: {
    rollupOptions: {
      output: {
        manualChunks: {
          // React core
          'vendor-react': ['react', 'react-dom', 'react/jsx-runtime'],
          // Routing
          'vendor-router': ['react-router-dom', 'react-router'],
          // Server state
          'vendor-query': ['@tanstack/react-query'],
          // Supabase (large — keep separate for caching)
          'vendor-supabase': ['@supabase/supabase-js'],
          // Heavy charting library (admin dashboard only)
          'vendor-charts': ['recharts'],
          // Markdown editor (admin post form only)
          'vendor-md-editor': ['@uiw/react-md-editor'],
          // Lucide icons
          'vendor-icons': ['lucide-react'],
        },
      },
    },
    chunkSizeWarningLimit: 600,
  },
})
