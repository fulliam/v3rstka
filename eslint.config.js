import { defineConfig } from 'eslint-define-config';
import vue from 'eslint-plugin-vue';
import typescriptParser from '@typescript-eslint/parser';
import typescript from '@typescript-eslint/eslint-plugin';
import prettier from 'eslint-plugin-prettier';
import vueParser from 'vue-eslint-parser';

export default defineConfig([
  {
    ignores: ['node_modules/**', 'dist/**'],
    files: ['src/**/*.{js,ts,vue}'],
    languageOptions: {
      parser: vueParser,
      ecmaVersion: 'latest',
      sourceType: 'module',
      parserOptions: {
        parser: typescriptParser,
      },
    },
    plugins: {
      vue,
      '@typescript-eslint': typescript,
      prettier,
    },
    rules: {
      'vue/multi-word-component-names': 'off',
      '@typescript-eslint/no-unused-vars': 'warn',
      '@typescript-eslint/explicit-module-boundary-types': 'off',
      'prettier/prettier': 'warn',
    },
  },
  {
    files: ['*.js', '*.ts', '*.vue'],
    rules: {
      'prettier/prettier': 'warn',
    },
  },
]);
