module.exports = {
  testEnvironment: 'node',
  testTimeout: 30000,

  testMatch: ['<rootDir>/test/**/*spec.{ts,js}'],
  moduleFileExtensions: ['js', 'json', 'ts'],
  modulePaths: ['<rootDir>', 'src'],
  preset: 'ts-jest',

  collectCoverageFrom: [
    '<rootDir>/src/**/*.(t|j)s',
    '!**/*spec.(t|j)s',
    '!<rootDir>/src/main.ts',
    '!<rootDir>/src/device/controller/device.controller.ts',
    '!<rootDir>/src/mqtt/**/*.ts',
  ],
  coverageDirectory: '<rootDir>/report/coverage',
};
