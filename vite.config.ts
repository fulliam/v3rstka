import { defineConfig } from 'vite';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import path from 'path';
import { emptySourcemapFix } from './plugins';

export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    plugins: [
      vue(), 
      isProduction && emptySourcemapFix(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
        ],
        dts: './src/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './eslint.auto-imports.json',
          globalsPropValue: true,
        },
      }),
    ].filter(Boolean),
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
          additionalData: '@use "@/assets/styles/index.scss" as *;',
          silenceDeprecations: ['legacy-js-api'],
        }
      }
    },
  }
})
