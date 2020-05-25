module.exports = {
  collectCoverageFrom: [
    'src/**/*.mjs',
  ],
  coverageDirectory: './coverage/',
  moduleFileExtensions: ['js', 'mjs'],
  testMatch: [
    '**/spec/**/*.spec.mjs',
  ],
  transform: {
    '^.+\\.mjs$': 'babel-jest',
  },
  verbose: true,
};
