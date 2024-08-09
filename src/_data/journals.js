// Just the journal pages

import pages from "./pages.js"

function isJournal(page) {
  return page["page-name"].match(/^\d{4}-\d{2}-\d{2}/)
}

export default function() {
  return pages
    .filter(isJournal)
    .sort((a, b) => (b["page-name"].localeCompare(a["page-name"])))
};