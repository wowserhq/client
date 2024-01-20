module.exports = {
  collectCoverageFrom: [
    'src/**/*.js',
    'src/**/*.ts',
  ],
  coverageDirectory: './coverage/',
  moduleFileExtensions: ['js', 'ts'],
  testMatch: [
    '**/spec/**/*.spec.js',
  ],
  verbose: true,
};
