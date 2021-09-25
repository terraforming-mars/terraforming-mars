// Operating system agnostic version of gzip.

const fs = require('fs');
const zlib = require('zlib');

const fileContents = fs.createReadStream('./build/styles.css');
const writeStream = fs.createWriteStream('./build/styles.css.gz');
const zip = zlib.createGzip();

fileContents.pipe(zip).pipe(writeStream);
