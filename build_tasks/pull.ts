import * as dotenv from "dotenv";
import fs from "fs-plus";
import slug from "slug";

import { Block, Graph, Page, RawPage } from "../src/_lib/types";

dotenv.config();

const datePattern = /^\d{4}-\d{2}-\d{2}$/;

function determinePermalink(page: RawPage) {
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

function extractPublicContent(block: Block) {
  if (!isPublic(block)) {
    block.content = "";
    // Shallow check for blocks I want to share in private pages.
    // Mostly for cool stuff in the journal.
    block.children = getPublicChildren(block);
  }

  return block;
}

function getPublicChildren(block: Block) {
  return block.children.filter((child) => isPublic(child));
}

function hasPublicContent(block: Block) {
  if (!isPublic(block)) {
    return block.children.length > 0;
  }

  if (block.content === "") return false;

  return true;
}

function isPublic(block: Block) {
  if (block.properties == undefined) return false;

  if (block.properties["public"] == undefined) return false;

  return block.properties["public"];
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
const rawGraph = JSON.parse(rawJson)

const pages: Page[] = rawGraph["blocks"]
  .map((pageBlock: RawPage) => {
    return {
      ...pageBlock,
      permalink: determinePermalink(pageBlock),
    };
  })
  .map(extractPublicContent)
  .filter(hasPublicContent);

const graph: Graph = {
  blocks: pages,
  version: rawGraph["version"],
};

// Write this public graph to a data file.
const graphJSON = JSON.stringify(graph, null, 2);
fs.writeFileSync("src/_data/graph.json", graphJSON);
