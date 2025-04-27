import { dirname } from "path";
import { fileURLToPath } from "url";
import { FlatCompat } from "@eslint/eslintrc";

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

const compat = new FlatCompat({
  baseDirectory: __dirname,
});

/** @type {import('eslint').Linter.FlatConfig[]} */
const eslintConfig = [
  {
    ignores: ["**/node_modules/*", ".next/*", "dist/*"]
  },
  ...compat.extends(
    "next/core-web-vitals"
  ),
  {
    files: ["**/*.ts", "**/*.tsx"],
    rules: {
      // Temporarily disable strict TypeScript rules
      "@typescript-eslint/no-explicit-any": "off",
      "@typescript-eslint/explicit-function-return-type": "off",
      "@typescript-eslint/no-unused-vars": ["warn", {
        argsIgnorePattern: "^_",
        varsIgnorePattern: "^_",
        ignoreRestSiblings: true
      }],
      "@typescript-eslint/no-unsafe-assignment": "off",
      "@typescript-eslint/no-unsafe-member-access": "off",
      "@typescript-eslint/no-unsafe-call": "off",
      "@typescript-eslint/no-unsafe-argument": "off",
      "@typescript-eslint/no-floating-promises": "off",
      "@typescript-eslint/no-misused-promises": "off",
      "@typescript-eslint/ban-ts-comment": ["warn", {
        "ts-expect-error": "allow-with-description",
        "ts-ignore": true,
        minimumDescriptionLength: 10
      }],

      // Keep important React rules
      "react/no-unescaped-entities": "off",
      "react/jsx-no-target-blank": ["warn", {
        allowReferrer: false,
        enforceDynamicLinks: "always",
      }],
      
      // Keep important Next.js rules but as warnings
      "@next/next/no-img-element": "warn",
      "@next/next/no-html-link-for-pages": "warn",

      // General best practices as warnings
      "no-console": ["warn", { 
        allow: ["warn", "error", "info"] 
      }],
      "prefer-const": "warn",
      "no-var": "warn"
    }
  }
];

export default eslintConfig;
