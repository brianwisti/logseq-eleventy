const graphData = require("./graph.json");

function extractPublicContent(page) {
  if (!isPublic(page)) {
    page.content = "";
    // Shallow check for blocks I want to share in private pages.
    // Mostly for cool stuff in the journal.
    page.children = getPublicChildren(page);
  }

  return page;
}

function getPublicChildren(page) {
  return page.children.filter((child) => isPublic(child))

}

function hasPublicContent(page) {
  if (!isPublic(page)) {
    return page.children.length > 0;
  }

  if (page.content === "")
    return false;

  return true;
}

function isPublic(page) {
  if (page.properties == undefined)
    return false;

  if (page.properties["public"] == undefined)
    return false;

  return page.properties["public"];
}

module.exports = function() {
  return graphData.blocks
    .map(extractPublicContent)
    .filter(hasPublicContent);
};