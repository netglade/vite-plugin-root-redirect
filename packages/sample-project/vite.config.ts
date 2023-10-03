import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { rootRedirect } from '../../src/rootRedirect'
import path from 'path'
import Inspect from 'vite-plugin-inspect'

// https://vitejs.dev/config/
export default defineConfig({
  build: {
    rollupOptions: {
      input: {
        main: path.resolve(__dirname, 'index.html'),
      }
    }
  },

  server: {
    host: 'localhost',
    port: 5173,
  },

  plugins: [
    vue(),
    rootRedirect({
      url: 'http://localhost:5173/src/views/App/index.html'
    }),
    Inspect(),
  ],
})
