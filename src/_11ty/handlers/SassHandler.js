// Processes my Sass stylesheets

const fs = require("fs-plus");
const path = require("path");
const sass = require("sass");

let lastSassBuild = 0;     // epoch of last sass build
const minimumWait = 5_000; // wait this many seconds before rebuilding

// We only build the main sass file
const curDir = process.cwd();
const sassInputPath = path.join(curDir, "src/assets/style/main.scss");
const cssOutputPath = path.join(curDir, "_site/assets/style/main.css");

module.exports = {
  compileOptions: {
    permalink: false,
  },
  compile: async function(inputContent, inputPath) {
    const now = new Date().valueOf();

    if (now - lastSassBuild <= minimumWait) {
      return;
    }

    lastSassBuild = now;
    console.log(`[${now}] SassHandler: ${inputPath} changed`);
    console.log(`Building ${sassInputPath}`);

    return async (data) => {
      let result = sass.renderSync({
        file: sassInputPath,
      });

      const cssText = result.css.toString("utf8");
      fs.makeTreeSync(path.dirname(cssOutputPath));
      fs.writeFileSync(cssOutputPath, cssText);
    };
  },
};