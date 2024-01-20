// TODO: Expand @wowserhq/eslint-config with TypeScript variant
module.exports = {
  extends: [
    'eslint:recommended',
    'plugin:@typescript-eslint/recommended',
    'plugin:import/recommended',
    'plugin:import/typescript',
  ],
  parser: '@typescript-eslint/parser',
  plugins: ['@typescript-eslint'],
  root: true,
  env: { browser: true, node: true },
  rules: {
    'camelcase': 'off',
    'no-console': 'off',
    'no-unused-vars': ['error', {
      'argsIgnorePattern': '^_',
      'varsIgnorePattern': '^_'
    }],
    'quotes': ['error', 'single', {
      'avoidEscape': true
    }],
    'semi': ['warn'],
  },
};
