import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  base: process.env.NODE_ENV === 'production' ? '/pi-server/' : '/',
  build: {
    outDir: 'dist',
    sourcemap: true,
    rollupOptions: {
      output: {
        manualChunks: {
          // React and core libraries
          'react-vendor': ['react', 'react-dom', 'react-router-dom'],
          
          // UI and animation libraries
          'ui-vendor': ['lucide-react', 'framer-motion'],
          
          // Removed syntax-highlighter chunk since we're using a custom lightweight solution
          
          // Application code chunks
          'pages': [
            './src/pages/HomePage',
            './src/pages/OverviewPage', 
            './src/pages/PhasePage'
          ],
          'components': [
            './src/components/Header',
            './src/components/Sidebar',
            './src/components/StepCard',
            './src/components/CodeBlock'
          ]
        }
      },
      // Removed external Prism configuration since we're using a custom lightweight solution
    },
    // Increase chunk size warning limit since we're optimizing
    chunkSizeWarningLimit: 1000,
    // Removed Prism optimization since we're using a custom lightweight solution
  }
})
