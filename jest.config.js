// jest.config.js
/** @type {import('jest').Config} */
const config = {
  // Memberi tahu Jest untuk memperlakukan file .js sebagai ES Modules
  // Ini memberitahu Jest untuk tidak mencoba mengubah import/export statement
  // tapi untuk menganggapnya sebagai modul ES native.
  transform: {}, // Menonaktifkan transformasi default untuk ES Modules

  // Ini penting jika Anda menggunakan sintaks import/export di file JS biasa (.js)
  // dan tidak menggunakan ".mjs"
  extensionsToTreatAsEsm: ['.js'],

  // Pastikan Jest tahu untuk menguji file .js, .mjs, dll.
  moduleFileExtensions: ['js', 'mjs', 'cjs', 'json', 'node'],

  // Lingkungan pengujian yang mensimulasikan browser DOM
  testEnvironment: 'jsdom',
};

module.exports = config;