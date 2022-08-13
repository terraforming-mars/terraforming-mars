// Operating system agnostic version of gzip.

const fs = require('fs');
const zlib = require('zlib');

const fileContents = fs.createReadStream('./build/styles.css');
const writeStreamGz = fs.createWriteStream('./build/styles.css.gz');
const writeStreamBr = fs.createWriteStream('./build/styles.css.br');
const zip = zlib.createGzip();

fileContents.pipe(zip).pipe(writeStreamGz);

const br = zlib.createBrotliCompress({
  chunkSize: 16 * 1024,
  params: {
    [zlib.constants.BROTLI_PARAM_MODE]: zlib.constants.BROTLI_MODE_TEXT,
    [zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY,
  },
});

fileContents.pipe(br).pipe(writeStreamBr);
