// Just the journal pages

const pages = require("./pages.js");

function isJournal(page) {
  return page["page-name"].match(/^\d{4}-\d{2}-\d{2}/)
}

module.exports = function() {
  return pages()
    .filter(isJournal)
    .sort((a, b) => (b["page-name"].localeCompare(a["page-name"])))
};