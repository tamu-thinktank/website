/** @type {import('prettier').Config & import('prettier-plugin-tailwindcss').PluginOptions} */
const config = {
  plugins: ["prettier-plugin-tailwindcss"],
  tabWidth: 2,
  useTabs: false,
  singleQuote: false, // Ensures double quotes in JSON and JavaScript
  overrides: [
    {
      files: "*.json",
      options: {
        parser: "json",
        singleQuote: false, // JSON requires double quotes
      },
    },
    {
      files: "*.yaml",
      options: {
        parser: "yaml",
      },
    },
  ],
};

export default config;
