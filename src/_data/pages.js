"use strict";

import fs from "fs-plus";
import slug from "slug";
import * as dotenv from "dotenv";

dotenv.config();

const graphData = () => {
  const exportDir = process.env["EXPORT_DIR"];
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

  let graph = JSON.parse(rawJson);
  graph["blocks"].forEach((pageBlock) => {
    pageBlock["permalink"] = determinePermalink(pageBlock);
  });

  return graph;
};

function buildTree(graph) {
  const pageNames = graph["blocks"].map((page) => page["page-name"]);

  return graph.map((page) => {
    page.subpages = pageNames.filter((name) => name.startsWith(page["page-name"] + "/"));
  });
}

function determinePermalink(page) {
  // split the page by folder slashes and slugify each part
  const parts = page["page-name"].split("/").map((part) => slug(part));

  return parts.join("/");
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

export default graphData().blocks.map(extractPublicContent).filter(hasPublicContent);
