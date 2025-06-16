import { fileURLToPath, URL } from 'node:url';
import vue from '@vitejs/plugin-vue';
import AutoImport from 'unplugin-auto-import/vite';
import { defineConfig } from 'vite';
import { emptySourcemapFix } from './plugins';


export default defineConfig(({ mode }) => {
  const isProduction = mode === 'production';

  return {
    mode: process.env.NODE_ENV || 'production',
    plugins: [
      vue(),
      !isProduction && emptySourcemapFix(),
      AutoImport({
        imports: [
          'vue',
          'vue-router',
          'pinia',
          // {
          //   // если нужно — можно вручную указать именованные экспорт из ваших утилит
          //   '@/utils/api': [
          //     'fetchUser',
          //     ['default', 'api'], // import api from '@/utils/api'
          //   ],
          // },
        ],
        dts: 'src/declares/auto-imports.d.ts',
        eslintrc: {
          enabled: true,
          filepath: './eslint.auto-imports.json',
          globalsPropValue: true,
        },
      }),

      // Авто-регистрация Vue-компонентов
      // Components({
      //   dirs: ['src/components'],
      //   extensions: ['vue'],
      //   dts: 'src/components.d.ts',
      // }),
    ].filter(Boolean),
    server: {
      port: 8080,
    },
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
    css: {
      preprocessorOptions: {
        scss: {
          additionalData: '@use "@/assets/styles/index.scss" as *;',
          silenceDeprecations: ['legacy-js-api'],
        },
      },
    },
    build: {
      chunkSizeWarningLimit: 1600,
    },
  };
});
