#!/usr/bin/env node

const sass = require('node-sass');
const fs = require('fs-extra');
const util = require('util');

const renderSass = util.promisify(sass.render);
// const inputFile = './assets/css/just-the-docs-default.scss';
// const inputFile = './src/assets/css/styles.scss';
const inputFile = '_site/raw-assets/sass/just-the-docs-default.scss';
const outputFile = './_site/assets/css/just-the-docs-default.css';
const isProduction = process.env.ELEVENTY_ENV;

const buildSass = async function () {
  const { css } = await renderSass({
    file: inputFile,
    includePaths: [
      'node_modules/foundation-sites/scss/',
      'node_modules/slick-carousel/slick/',
      'node_modules/hamburgers/_sass/hamburgers',
      'node_modules/prismjs/themes',
    ],
    outputStyle: isProduction ? 'compressed' : 'nested',
  });

  // This is a hint to know if this is a first run, in which case
  // we don't need to tell browserSync to update.
  const fileExisted = await fs.pathExists(outputFile);

  try {
    await fs.ensureFile(outputFile);
    await fs.writeFile(outputFile, css);
    console.log("writing", outputFile)
  } catch (error) {
    console.error(`Error writing generated CSS: ${error}`);
  }

  // TODO
//   if (!isProduction && fileExisted) {
//     // Tell browserSync to reload.
//     try {
//       await fetch(
//         'http://localhost:8081/__browser_sync__?method=reload&args=styles.css'
//       );
//     } catch (error) {
//       console.error(`Couldn't communicate with browserSync!`);
//     }
//   }
};
buildSass();