module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.ts',
  ],
  coverageDirectory: './coverage/',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: [
    '**/*.test.js',
    '**/*.test.ts',
  ],
  verbose: true,
};
