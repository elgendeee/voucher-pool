module.exports = {
    preset: 'ts-jest',
    testEnvironment: 'node',
    transform: {
        '^.+\\.tsx?$': ['ts-jest', {
            isolatedModules: true
        }]
    },
    moduleFileExtensions: ['ts', 'tsx', 'js', 'jsx', 'json', 'node'],
    testRegex: '(/__tests__/.*|(\\.|/)(test|spec))\\.(ts|tsx)$',
    collectCoverage: true,
    coverageReporters: ['text', 'lcov'],
    coverageDirectory: 'coverage',
    setupFilesAfterEnv: ['<rootDir>/test/setup.ts'],
    testPathIgnorePatterns: ['/node_modules/', '/dist/'],
    projects: [
        {
            displayName: 'unit',
            testMatch: ['<rootDir>/test/unit/**/*.test.ts'],
            testEnvironment: 'node',
        }
    ],
    transformIgnorePatterns: [
        '/node_modules/(?!.*\\.mjs$)'
    ]
};