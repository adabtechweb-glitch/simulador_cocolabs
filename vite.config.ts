import { defineConfig } from 'vite'
import path from 'path'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'
import { viteSingleFile } from 'vite-plugin-singlefile'

export default defineConfig({
  plugins: [
    react(),
    tailwindcss(),
    viteSingleFile(), // Esto hace que todo quede en un solo HTML
  ],
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src'),
    },
  },
  build: {
    cssCodeSplit: false,        // Todo el CSS en un solo archivo
    assetsInlineLimit: Infinity, // Convierte todas las imágenes/fuentes a Base64
    rollupOptions: {
      output: {
        inlineDynamicImports: true, // Incrusta imports dinámicos en el bundle
      },
    },
    minify: 'esbuild', // Minimiza JS/CSS
  },
})
