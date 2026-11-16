// Removes the previous Vite client output without touching build/src (server).
import fs from 'node:fs';
import path from 'node:path';

const build = path.resolve('build');
if (!fs.existsSync(build)) {
  process.exit(0);
}

const ENTRY = /^(main|client|sw|styles).*\.(js|css)(\.map|\.gz|\.br)?$/;
const DIRECTORIES = new Set(['chunks', 'assets']);

for (const entry of fs.readdirSync(build, {withFileTypes: true})) {
  const full = path.join(build, entry.name);
  if (entry.isDirectory() && DIRECTORIES.has(entry.name)) {
    fs.rmSync(full, {recursive: true, force: true});
  } else if (entry.isFile() && ENTRY.test(entry.name)) {
    fs.rmSync(full, {force: true});
  }
}
