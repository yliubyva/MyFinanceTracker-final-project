import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import svgr from 'vite-plugin-svgr'
import { resolve } from 'path';
import { copyFileSync } from 'fs'

copyFileSync(resolve(__dirname, '_redirects'), resolve(__dirname, 'dist/_redirects'));
// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react(), svgr()],
})