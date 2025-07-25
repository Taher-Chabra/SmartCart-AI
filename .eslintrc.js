export default {
  parser: '@typescript-eslint/parser',

  parserOptions: {
    project: [
      './tsconfig.base.json',
      './app/frontend/tsconfig.json',
      './app/backend/tsconfig.json',
      './shared/tsconfig.json',
    ],

    ecmaVersion: 'latest',

    sourceType: 'module',
  },

  plugins: ['@typescript-eslint', 'prettier'],

  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:@typescript-eslint/recommended-requiring-type-checking',

    'plugin:prettier/recommended',
  ],

  rules: {
    'no-console': ['warn', { allow: ['warn', 'error'] }],

    '@typescript-eslint/no-unused-vars': ['warn', { argsIgnorePattern: '^_' }],
  },

  overrides: [
    {
      files: ['*.js', '*.jsx'],
      parserOptions: {
        project: [],
      },
      rules: {
        '@typescript-eslint/no-var-requires': 'off',
      },
    },
    {
      files: ['app/frontend/**/*.ts', 'app/frontend/**/*.tsx'],
      extends: ['plugin:react/recommended', 'plugin:react-hooks/recommended'],
      settings: {
        react: {
          version: 'detect',
        },
      },
      rules: {},
    },
  ],
};
