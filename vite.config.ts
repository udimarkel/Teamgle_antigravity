import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import { quasar, transformAssetUrls } from '@quasar/vite-plugin'

// https://vitejs.dev/config/
export default defineConfig({
  base: '/Teamgle/',
  plugins: [
    vue({
      template: { transformAssetUrls }
    }),

    quasar({
      sassVariables: 'src/quasar-variables.sass'
    })
  ],
  build: {
    rollupOptions: {
      output: {
        sanitizeFileName: (name) => {
          const match = /^[a-z]:/i.exec(name)
          const driveLetter = match ? match[0] : ''
          return (
            driveLetter +
            name.substr(driveLetter.length).replace(/[\x00-\x1F\x7F<>*|"\\/?:_]/g, '')
          )
        },
        // Force manual chunks or naming pattern if cleaner names needed
        chunkFileNames: 'assets/js/[name]-[hash].js',
        entryFileNames: 'assets/js/[name]-[hash].js',
        assetFileNames: 'assets/[ext]/[name]-[hash].[ext]'
      }
    }
  }
})
