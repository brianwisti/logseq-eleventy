// Processes my Sass stylesheets

import fs from "fs-plus";
import path from "path";
import * as sass from "sass";

let lastSassBuild = 0;     // epoch of last sass build
const minimumWait = 5_000; // wait this many seconds before rebuilding

// We only build the main sass file
const curDir = process.cwd();
const sassInputPath = path.join(curDir, "src/assets/style/main.scss");
const cssOutputPath = path.join(curDir, "_site/assets/style/main.css");

export default {
  compileOptions: {
    permalink: false,
  },
  compile: async function (_inputContent: string, inputPath: string) {
    const now = new Date().valueOf();

    if (now - lastSassBuild <= minimumWait) {
      return;
    }

    lastSassBuild = now;
    console.log(`[${now}] SassHandler: ${inputPath} changed`);
    console.log(`Building ${sassInputPath}`);

    return async (_data: string) => {
      const result = await sass.compileAsync(sassInputPath);
      const cssText = result.css.toString();
      fs.makeTreeSync(path.dirname(cssOutputPath));
      fs.writeFileSync(cssOutputPath, cssText);
    };
  },
};