"use strict";

import fs from "fs-plus";
import slug from "slug";
import * as dotenv from "dotenv";

dotenv.config();

type Properties = {
  public: boolean;
};

type Block = {
  id: string;
  format: string;
  properties: Properties;
  content: string;
  children: Block[];
};

type RawPage = Block & {
  "page-name": string;
};

export type Page = RawPage & {
  permalink: string;
};

type Graph = {
  blocks: Page[];
  version: Number;
};

const graphData = (): Graph => {
  const exportDir = process.env["EXPORT_DIR"] as string;
  const graphName = process.env["GRAPH_NAME"] as string;

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
  const rawGraph = JSON.parse(rawJson);

  const pages: Page[] = rawGraph["blocks"].map((pageBlock: RawPage) => {
    return {
      ...pageBlock,
      permalink: determinePermalink(pageBlock),
    };
  });

  return {
    blocks: pages,
    version: rawGraph["version"],
  }
};

function determinePermalink(page: RawPage) {
  // split the page by folder slashes and slugify each part
  const parts = page["page-name"].split("/").map((part) => slug(part));

  return parts.join("/");
}

function extractPublicContent(page: Page) {
  if (!isPublic(page)) {
    page.content = "";
    // Shallow check for blocks I want to share in private pages.
    // Mostly for cool stuff in the journal.
    page.children = getPublicChildren(page);
  }

  return page;
}

function getPublicChildren(page: Page) {
  return page.children.filter((child) => isPublic(child));
}

function hasPublicContent(page: RawPage) {
  if (!isPublic(page)) {
    return page.children.length > 0;
  }

  if (page.content === "") return false;

  return true;
}

function isPublic(block: Block) {
  if (block.properties == undefined) return false;

  if (block.properties["public"] == undefined) return false;

  return block.properties["public"];
}

export default () => graphData().blocks.map(extractPublicContent).filter(hasPublicContent);
