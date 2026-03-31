import react from '@vitejs/plugin-react'
import { defineConfig } from 'vite'
import path from 'path'
import { fileURLToPath } from 'url'

// Получаем текущую директорию (обязательно для проектов с "type": "module")
const __dirname = path.dirname(fileURLToPath(import.meta.url))

export default defineConfig({
  logLevel: 'error', // Показываем только ошибки, скрываем предупреждения
  plugins: [
    react()
  ],
  build: {
    modulePreload: {
      polyfill: true,
    },
    cssCodeSplit: true,
    minify: 'esbuild', // Явно включаем быструю минификацию
    rollupOptions: {
      output: {
        manualChunks(id) {
          if (id.includes('node_modules')) {
            return 'vendor';
          }
        },
      },
    },
  },
  resolve: {
    alias: {
      '@': path.resolve(__dirname, './src') // Говорим Vite, что @ = папка src
    }
  }
});