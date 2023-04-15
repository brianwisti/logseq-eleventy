// A Nunjucks filter to filter block content through LogseqMarkdownHandler

const LogseqMarkdownHandler = require("../handlers/LogseqMarkdownHandler.js");

const md = LogseqMarkdownHandler();

module.exports = function(content) {
  return md.render(content);
}