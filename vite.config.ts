// import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import utwm from 'unplugin-tailwindcss-mangle/vite'
const projectRoot = new URL('./src', import.meta.url).pathname

console.log('-------projectRoot-------', projectRoot)

// https://vite.dev/config/
export default defineConfig({
  plugins: [vue(), utwm(), vueDevTools()],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'vue-multi-date-picker',
      // the proper extensions will be added
      fileName: 'vue-multi-date-picker',
    },
    rollupOptions: {
      // make sure to externalize deps that shouldn't be bundled
      // into your library
      external: ['vue'],
      output: {
        // Provide global variables to use in the UMD build
        // for externalized deps
        globals: {
          vue: 'Vue',
        },
      },
    },
  },
  resolve: {
    alias: {
      // '@': fileURLToPath(new URL('./src', import.meta.url)),
      '@': projectRoot,
    },
  },
})
