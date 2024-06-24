"use strict";

require("dotenv").config();

const fs = require("fs-plus");
const slug = require("slug");

const datePattern = /^\d{4}-\d{2}-\d{2}$/;


function determinePermalink(page) {
  const pageName = page["page-name"];
  const nameSlug = pageName.split("/")
    .map((step) => slug(step))
    .join("/");

  if (pageName.startsWith("post/") || pageName.startsWith("note/")) {
    return nameSlug;
  }

  if (datePattern.test(pageName)) {
    const [year, month, _] = pageName.split("-")
    return `journal/${year}/${month}/${nameSlug}`;
  }

  return `page/${nameSlug}`;
}

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
  return page.children.filter((child) => isPublic(child));
}

function hasPublicContent(page) {
  if (!isPublic(page)) {
    return page.children.length > 0;
  }

  if (page.content === "") return false;

  return true;
}

function isPublic(page) {
  if (page.properties == undefined) return false;

  if (page.properties["public"] == undefined) return false;

  return page.properties["public"];
}

const exportDir = process.env["GRAPH_EXPORT_FOLDER"];
const graphName = process.env["GRAPH_NAME"];

if (exportDir == undefined) {
  throw new Error("Required environment variable missing: EXPORT_DIR");
}

if (graphName == undefined) {
  throw new Error("Required environment variable missing: GRAPH_NAME");
}

const filename = fs
  .listSync(exportDir)
  .sort()
  .findLast((filename) => filename.includes(graphName));
const rawJson = fs.readFileSync(filename).toString();

let graph = JSON.parse(rawJson).blocks
    .map(extractPublicContent)
    .filter(hasPublicContent);

graph.forEach((pageBlock) => {
  pageBlock["permalink"] = determinePermalink(pageBlock);
});

// Write this public graph to a data file.
const graphJSON = JSON.stringify(graph, null, 2);
fs.writeFileSync("src/_data/graph.json", graphJSON);
