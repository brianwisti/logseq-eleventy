import * as dotenv from "dotenv";
import { UserConfig } from "@11ty/eleventy"

import LogseqMarkdownFilter from "./src/_11ty/filters/LogseqMarkdownFilter";
import SassHandler from "./src/_11ty/handlers/SassHandler";
import plausibleShortcode from "./src/_11ty/shortcodes/plausibleShortcode";

dotenv.config();

export default function (eleventyConfig: UserConfig) {
  eleventyConfig.addPassthroughCopy("src/assets/*.png");
  eleventyConfig.addTemplateFormats("scss");
  eleventyConfig.addExtension("scss", SassHandler);

  eleventyConfig.addNunjucksFilter("logseq_markdown", LogseqMarkdownFilter);

  eleventyConfig.addNunjucksShortcode("plausible", plausibleShortcode);

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
