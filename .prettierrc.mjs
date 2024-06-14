// .prettierrc.mjs
/** @type {import("prettier").Config} */
export default {
  plugins: ["prettier-plugin-jinja-template"],
  overrides: [
    {
      files: ["*.njk"],
      options: {
        parser: "jinja-template",
      },
    },
  ],
};
