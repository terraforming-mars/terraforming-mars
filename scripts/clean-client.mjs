// Removes the previous Vite client output without touching build/src (server) or build/styles.css.
import fs from 'node:fs';
import path from 'node:path';

const build = path.resolve('build');
if (!fs.existsSync(build)) {
  process.exit(0);
}

const ENTRY = /^(main|client|sw).*\.(js|css)(\.map|\.gz|\.br)?$/;
const MANIFEST = new Set(['main-manifest.json', 'main-manifest.json.gz', 'main-manifest.json.br']);
const DIRECTORIES = new Set(['chunks', 'assets']);

for (const entry of fs.readdirSync(build, {withFileTypes: true})) {
  const full = path.join(build, entry.name);
  if (entry.isDirectory() && DIRECTORIES.has(entry.name)) {
    fs.rmSync(full, {recursive: true, force: true});
  } else if (entry.isFile() && (ENTRY.test(entry.name) || MANIFEST.has(entry.name))) {
    fs.rmSync(full, {force: true});
  }
}
