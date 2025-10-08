// TODO: Expand @wowserhq/eslint-config with TypeScript variant
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  parserOptions: {
    project: ['./tsconfig.eslint.json'],
  },
  plugins: ['@typescript-eslint'],
  root: true,
  env: { browser: true, node: true },
  rules: {
    '@typescript-eslint/no-this-alias': 'off',
    '@typescript-eslint/no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    '@typescript-eslint/strict-boolean-expressions': ['error', {
      allowNullableBoolean: true,
      allowNullableString: true,
    }],
    'camelcase': 'off',
    'no-cond-assign': 'off',
    'no-console': 'off',
    'quotes': ['error', 'single', {
      'avoidEscape': true
    }],
    'semi': ['warn'],
  },
};
