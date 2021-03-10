module.exports = {
  cacheDirectory: '<rootDir>/.cache',
  testMatch: ['<rootDir>/src/test/**/*.spec.ts'],
  testPathIgnorePatterns: ['node_modules'],
  transform: {
    '^.+\\.ts?$': 'ts-jest'
  }
};
