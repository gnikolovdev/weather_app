import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'
import sass from 'sass';

// https://vitejs.dev/config/
export default defineConfig({
  base: "./",
  plugins: [react()],
  resolve: {
    alias: {
      "@components": "/src/components",
      "@pages": "/src/pages",
      "@utilities": "/src/utilities",
    },
  },
  css: {
    preprocessorOptions: {
      scss: {
        implementation: sass,
        additionalData: '@use "./src/assets/styles/sass/Variables.scss" as *;'
      },
    },
  },
})
