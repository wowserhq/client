module.exports = {
  collectCoverageFrom: [
    'src/**/*.{js,mjs}',
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
