import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import path from 'path'

// https://vitejs.dev/config/
export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production'
  
  return {
    plugins: [react()],
    // Base path matching GitHub repository name for GitHub Pages deployment
    base: '/partitura/',
    resolve: {
      alias: {
        '@': path.resolve(__dirname, './src'),
      },
    },
    server: {
      port: 5173,
      strictPort: true,
    },
    build: {
      outDir: 'dist',
      sourcemap: !isProduction,
      // Reduce chunk size for better loading performance
      chunkSizeWarningLimit: 1000,
      minify: isProduction ? 'esbuild' : false,
      rollupOptions: {
        output: {
          manualChunks: {
            react: ['react', 'react-dom', 'react-router-dom'],
            pdf: ['react-pdf'],
            ui: ['framer-motion', 'lucide-react', '@heroicons/react'],
            data: ['chart.js', 'react-chartjs-2', 'date-fns'],
            supabase: ['@supabase/supabase-js'],
          }
        }
      }
    },
    optimizeDeps: {
      include: ['react', 'react-dom', 'react-router-dom']
    }
  }
}) 