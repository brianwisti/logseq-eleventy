// Handle the particulars of rendering a Logseq Markdown block

const MarkdownIt = require("markdown-it");

module.exports = function () {
  return MarkdownIt({
    typographer: true,
    linkify: true,
  });
}