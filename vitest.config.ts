import { defineConfig } from 'vitest/config';

export default defineConfig({
  test: {
    globals: true,
    environment: 'node',
    setupFiles: './src/models/helpers/_testCommon.ts', // Ensure the path is correct
    // singleThread: true,
    maxConcurrency: 1,
  },
});

