import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import {rootRedirect} from "@netglade/vite-plugin-root-redirect";

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [
    react(),
    rootRedirect({
      url: 'http://localhost:5173/src/views/Dashboard/index.html'
    }),
  ],
})
