// For a detailed explanation regarding each configuration property, visit:
// https://jestjs.io/docs/en/configuration.html

module.exports = {
  clearMocks: true,
  coverageDirectory: 'coverage',
  globals: {
    'ts-jest': {
      tsConfigFile: 'tsconfig.json',
    },
  },
  moduleFileExtensions: ['js', 'ts'],
  testEnvironment: 'node',
  testMatch: ['**/__tests__/**/*.+(ts|tsx|js)'],
  testPathIgnorePatterns: ['node_modules', 'lib'],
  transform: {
    '^.+\\.(ts|tsx)$': 'ts-jest',
  },
};
