import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
const path = require('path')
const { resolve } = require('path')

export default defineConfig({
    build: {
        rollupOptions: {
            input: {
                popup: resolve(__dirname, 'popup.html'),
                options: resolve(__dirname, 'options.html'),
            }
        },
        emptyOutDir: true,
        watch: {}
    },
    plugins: [
        vue()
    ],
    resolve: {
        alias: {
            "@": path.resolve(__dirname, "./src"),
        },
    }
})