// vitest.config.ts
import { defineConfig } from 'vitest/config';

export default defineConfig({
    test: {
        environment: 'jsdom',
        globals: true,
        clearMocks: true,
        restoreMocks: true,
        mockReset: true,
        testTimeout: 5000,
        setupFiles: ['src/test-setup.ts'],
        coverage: {
            provider: 'v8',
            reporter: ['html', 'lcov', 'text'],
            reportsDirectory: './coverage',
            exclude: ['**/*.spec.ts', '**/*.config.ts', '**/test-setup.ts', '**/test.ts', 'node_modules/**', 'dist/**'],
        },
    },
});
