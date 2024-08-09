import fs from "fs-plus";

import { Page } from "../_lib/types";

const rawJson = fs.readFileSync("src/_data/graph.json").toString();
const pages: Page[] = JSON.parse(rawJson).blocks;

export default () => pages;
