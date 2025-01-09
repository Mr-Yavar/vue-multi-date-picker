import vue from '@vitejs/plugin-vue'
import path, { resolve } from 'path'
import { defineConfig } from 'vite'

// https://vitejs.dev/config/
export default defineConfig({
    plugins: [vue()],
    optimizeDeps: {
        exclude: [''],
    },
    resolve: {
        extensions: ['.js', '.ts', '.d.ts', '.vue', '.json'],
        alias: {
            '@': path.resolve(__dirname, './src'),
        },
    },
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
})
