// import { fileURLToPath, URL } from 'node:url'

import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import vueDevTools from 'vite-plugin-vue-devtools'
import { resolve } from 'path'
import utwm from 'unplugin-tailwindcss-mangle/vite'
const projectRoot = new URL('./src', import.meta.url).pathname
import dts from 'vite-plugin-dts'
import { fileURLToPath } from 'url'

console.log('-------projectRoot-------', projectRoot)

// https://vite.dev/config/
export default defineConfig({
  plugins: [
    vue(),
    utwm(),
    vueDevTools(),
    dts({ tsconfigPath: './tsconfig.app.json', copyDtsFiles: true }),
  ],
  build: {
    lib: {
      entry: resolve(__dirname, 'src/main.ts'),
      name: 'vue-multi-date-picker',
      formats: ['es', 'umd'],

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
    //Generates sourcemaps for the built files,
    //aiding in debugging.
    sourcemap: true,
    //Clears the output directory before building.
    emptyOutDir: true,
  },

  resolve: {
    alias: {
      '@': fileURLToPath(new URL('./src', import.meta.url)),
      // '@': projectRoot,
    },
  },
})
