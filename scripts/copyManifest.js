const path = require('path');
const fs = require('fs');

const pathToManifest = path.resolve(__dirname, '../src/manifest.json');
const destinationPath = path.resolve(__dirname, '../build/manifest.json');

fs.copyFile(pathToManifest, destinationPath, err => {
  if (err) {
    throw err;
  }
  console.log('Successfully copied manifest');
});
