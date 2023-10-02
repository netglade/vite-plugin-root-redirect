import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { shadowDom } from '../../src/shadowDom'
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
  plugins: [
    vue(),
    shadowDom({ logging: true }),
    Inspect(),
  ],
})
