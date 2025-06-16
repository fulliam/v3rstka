export default {
  semi: true,
  tabWidth: 2,
  singleQuote: true,
  printWidth: 80,
  trailingComma: 'es5',
  bracketSpacing: true,
  endOfLine: 'auto',
  htmlWhitespaceSensitivity: 'ignore',
  overrides: [
    {
      files: '*.vue',
      options: {
        singleAttributePerLine: true,
      },
    },
  ],
};
