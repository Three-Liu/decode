module.exports = {
  testMatch: ['**/__tests__/**/*.test.js'],
  projects: [
    {
      displayName: 'decoders',
      testEnvironment: 'node',
      testMatch: ['<rootDir>/__tests__/decoders/**/*.test.js'],
    },
    {
      displayName: 'content',
      testEnvironment: 'jsdom',
      testMatch: ['<rootDir>/__tests__/content.test.js'],
    },
  ],
};
