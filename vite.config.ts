import { defineConfig } from 'vite'
import vue from '@vitejs/plugin-vue'
import path from 'path'
import { emptySourcemapFix } from './plugins';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [vue(), !isProduction && emptySourcemapFix()].filter(Boolean),
    resolve: {
      alias: {
        '@': path.resolve(__dirname, 'src'),
      },
    },
    build: {
      sourcemap: true,
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@import "@/assets/styles/index.scss";'
        }
      }
    },
  }
})
