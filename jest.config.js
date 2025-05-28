// jest.config.js
/** @type {import('jest').Config} */
const config = {
  // Gunakan babel-jest untuk mentransformasi file JavaScript
  transform: {
    '^.+\\.(js|jsx|mjs|cjs|ts|tsx)$': 'babel-jest',
  },
  // Pastikan Jest mencari file test dan modul dengan ekstensi yang tepat
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'jsx', 'json', 'node'],
  // Lingkungan pengujian yang mensimulasikan browser DOM
  testEnvironment: 'jsdom',

  // Jika Anda menambahkan opsi "type": "module" di package.json,
  // Anda mungkin perlu opsi ini jika ada masalah:
  // preset: 'ts-jest', // Jika menggunakan TypeScript
  // extensionsToTreatAsEsm: ['.js', '.jsx'], // Hapus jika menimbulkan error validasi
  // moduleNameMapper: {
  //   '\\.(css|less|scss|sass)$': 'identity-obj-proxy',
  // },
};

module.exports = config;