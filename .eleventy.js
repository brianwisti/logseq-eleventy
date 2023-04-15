module.exports = function (eleventyConfig) {
  return {
    dir: {
      input: "_content",
      includes: "_includes",
      data: "_data",
      output: "_site",
    },
  };
};
