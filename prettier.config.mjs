/**
 * @see https://prettier.io/docs/en/configuration
 * @type {import("prettier").Config}
 */
const config = {
  printWidth: 100,
  singleQuote: true,
  semi: true,
  trailingComma: 'all',
  plugins: ['prettier-plugin-tailwindcss'],
  tailwindStylesheet: 'src/index.css',
};

export default config;
