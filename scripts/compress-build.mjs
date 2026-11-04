// Pre-compresses the Vite client output (main.js, chunks, client.css, sw.js) with gzip and brotli.
// ServeAsset serves build/<file>.br / .gz when the browser accepts them.
import fs from 'node:fs';
import path from 'node:path';
import zlib from 'node:zlib';

const root = path.resolve('build');
const SKIP_DIRECTORIES = new Set(['src', 'tests', 'node_modules']);
const COMPRESSIBLE = new Set(['.js', '.css', '.json', '.svg']);

function walk(directory) {
  for (const entry of fs.readdirSync(directory, {withFileTypes: true})) {
    const full = path.join(directory, entry.name);
    if (entry.isDirectory()) {
      if (!SKIP_DIRECTORIES.has(entry.name)) {
        walk(full);
      }
      continue;
    }
    if (!COMPRESSIBLE.has(path.extname(entry.name))) {
      continue;
    }
    const source = fs.readFileSync(full);
    fs.writeFileSync(full + '.gz', zlib.gzipSync(source, {level: 9}));
    fs.writeFileSync(full + '.br', zlib.brotliCompressSync(source, {
      params: {[zlib.constants.BROTLI_PARAM_QUALITY]: zlib.constants.BROTLI_MAX_QUALITY},
    }));
    console.log(`compressed ${path.relative(root, full)}`);
  }
}

walk(root);
