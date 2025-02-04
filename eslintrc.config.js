/** @type {import("eslint").Linter.Config} */
const config = {
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./server/tsconfig.json', './web/tsconfig.json'],
    tsconfigRootDir: __dirname,
    sourceType: 'module',
  },
  plugins: ['@typescript-eslint', 'simple-import-sort'],
  extends: [
    'next/core-web-vitals',
    // 'plugin:@typescript-eslint/recommended-type-checked',
    'plugin:@typescript-eslint/stylistic-type-checked',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  rules: {
    '@next/next/no-html-link-for-pages': [
      'error',
      `${__dirname}/web/src/pages`,
    ],
    '@typescript-eslint/array-type': 'off',
    '@typescript-eslint/consistent-type-definitions': 'off',
    '@typescript-eslint/consistent-type-imports': [
      'warn',
      {
        prefer: 'type-imports',
        fixStyle: 'inline-type-imports',
      },
    ],
    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
    'simple-import-sort/imports': 'error',
    'simple-import-sort/exports': 'error',
  },
  settings: {
    'import/resolver': {
      alias: {
        map: [
          [':root', __dirname],
          [':server', `${__dirname}/server/src`],
          ['~', `${__dirname}/web/src`],
          ['~', `${__dirname}/server/src`],
        ],
        extensions: ['.ts', '.tsx'],
      },
      node: true,
      typescript: true,
    },
  },
};

module.exports = config;
