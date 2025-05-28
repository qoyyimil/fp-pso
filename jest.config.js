const config = {
  transform: {
    '^.+\\.(js|jsx|mjs|cjs)$': ['babel-jest', { rootMode: "upward" }],
  },
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json', 'node'],
  testEnvironment: 'jsdom',
};

module.exports = config;