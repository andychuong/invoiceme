import { defineConfig } from "eslint/config";

const eslintConfig = defineConfig({
  ignores: [
    ".next/**",
    "out/**",
    "build/**",
    "next-env.d.ts",
  ],
  rules: {
    // Turn off practically all common rules for maximum leniency
    "no-unused-vars": "off",
    "no-undef": "off",
    "no-console": "off",
    "no-debugger": "off",
    "no-empty": "off",
    "no-mixed-spaces-and-tabs": "off",
    "semi": "off",
    "quotes": "off",
    "comma-dangle": "off",
    "no-redeclare": "off",
    "no-trailing-spaces": "off",
    "spaced-comment": "off",
    "indent": "off",
    "no-irregular-whitespace": "off",
    "eol-last": "off",
    "react/prop-types": "off",
    "react/jsx-uses-react": "off",
    "react/jsx-uses-vars": "off",
    "@typescript-eslint/no-unused-vars": "off",
    "@typescript-eslint/no-explicit-any": "off",
    "@typescript-eslint/explicit-module-boundary-types": "off",
    // Add more disables as needed
  },
  // No extends for simplicity, just bare minimum
  parserOptions: {
    ecmaVersion: "latest",
    sourceType: "module"
  }
});

export default eslintConfig;
