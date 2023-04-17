require("dotenv").config();

const LogseqMarkdownFilter = require("./src/_11ty/filters/LogseqMarkdownFilter.js");
const SassHandler = require("./src/_11ty/handlers/SassHandler.js");

module.exports = function (eleventyConfig) {
  // Let Eleventy handle SASS
  //  see https://www.11ty.dev/docs/languages/custom/#example-add-sass-support-to-eleventy
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", SassHandler);

  eleventyConfig.addNunjucksFilter("logseq_markdown", LogseqMarkdownFilter);

  return {
    dir: {
      input: "src",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
    markdownTemplateEngine: "njk",
    passthroughFileCopy: true,
  };
};
