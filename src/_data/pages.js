"use strict";

const fs = require("fs-plus");

const rawJson = fs.readFileSync("src/_data/graph.json").toString();

module.exports = () => JSON.parse(rawJson)
