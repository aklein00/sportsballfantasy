import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import tailwindcss from '@tailwindcss/vite'

export default defineConfig({
  plugins: [react(), tailwindcss()],
  server: {
    port: 8080,
    proxy: {
      // Proxy Rotowire RSS to avoid CORS
      '/rss/rotowire': {
        target: 'https://www.rotowire.com',
        changeOrigin: true,
        rewrite: path => '/baseball/rss-news.php',
      },
      // Proxy MLB API to avoid CORS edge cases
      '/mlb': {
        target: 'https://statsapi.mlb.com',
        changeOrigin: true,
        rewrite: path => path.replace(/^\/mlb/, ''),
      },
    },
  },
})
