module.exports = {
    testEnvironment: "jsdom",
    roots: ["<rootDir>/src"],
    testMatch: ["**/__tests__/**/*.test.ts", "**/__tests__/**/*.test.tsx"],
    moduleFileExtensions: ["ts", "tsx", "js", "jsx", "json"],
    transform: {
        "^.+\\.(ts|tsx|js|jsx)$": "babel-jest",
    },
    moduleNameMapper: {
        "^@nimpl/i18n/(.*)$": "<rootDir>/../package/src/$1",
        "^react$": "<rootDir>/node_modules/react",
        "^react-dom$": "<rootDir>/node_modules/react-dom",
    },
    setupFilesAfterEnv: ["<rootDir>/src/setup/jest.setup.ts"],
    collectCoverageFrom: [
        "<rootDir>/../package/src/**/*.{ts,tsx}",
        "!<rootDir>/../package/src/**/*.d.ts",
        "!<rootDir>/../package/src/i18n.ts",
        "!<rootDir>/../package/src/clientConfig.ts",
        "!<rootDir>/../package/src/getTranslation.ts",
        "!<rootDir>/../package/src/I18nTransmitter.tsx",
        "!<rootDir>/../package/src/ServerTranslation.tsx",
        "!<rootDir>/../package/src/configuration/**",
        "!<rootDir>/../package/src/helpers/**",
    ],
    coverageDirectory: "./coverage",
    coverageReporters: ["text", "lcov"],
    testTimeout: 5000,
};
