/* eslint-disable no-undef */
module.exports = {
  semi: false,
  endOfLine: 'auto',
  useTabs: false,
  singleQuote: true,
  overrides: [
    {
      files: ["**/*.css", "**/*.scss", "**/*.html", "**/*.hbs"],
      options: {
        singleQuote: false
      }
    }
  ]
}
