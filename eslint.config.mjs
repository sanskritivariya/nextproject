import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

const eslintConfig = [
  ...compat.extends("next/core-web-vitals", "next/typescript"),
];
module.exports = {
  rules: {
    'react/react-in-jsx-scope': 'off', // Not needed in Next.js 11+
    'no-unused-vars': 'warn',          // Just warn instead of error
    'no-console': 'off',               // Allow console logs
  }
};

export default eslintConfig;
