const fs = require("fs-plus");

const graphData = () => {
  const exportDir = process.env["EXPORT_DIR"];
  const graphName = process.env["GRAPH_NAME"];

  if (exportDir == undefined) {
    throw new Error("Required environment variable missing: EXPORT_DIR");
  }

  if (graphName == undefined) {
    throw new Error("Required environment variable missing: GRAPH_NAME");
  }

  const filename = fs.listSync(exportDir)
    .sort()
    .findLast((filename) => filename.includes(graphName));
  const rawJson = fs.readFileSync(filename).toString();

  return JSON.parse(rawJson);
};

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

module.exports = () =>
  graphData().blocks
    .map(extractPublicContent)
    .filter(hasPublicContent);
