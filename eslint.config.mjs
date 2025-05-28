import js from "@eslint/js";
import globals from "globals";
import { defineConfig } from "eslint/config";


export default defineConfig([
  {
    files: ["**/*.{js,mjs,cjs}"],
    plugins: { js },
    extends: ["js/recommended"],
    languageOptions: {
      globals: {
        ...globals.browser, // Memasukkan semua global browser standar
        restartGame: "writable", // Deklarasikan restartGame sebagai global dan bisa ditimpa
        resetScores: "writable" // Deklarasikan resetScores sebagai global dan bisa ditimpa
      }
    }
  },
]);