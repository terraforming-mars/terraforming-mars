require('dotenv').config();
import * as fs from 'fs';
import * as path from 'path';

import {MultiMap} from 'mnemonist';

function removeTrailingComma(str: string) {
  if (str.endsWith(',')) {
    return str.slice(0, -1); // Remove the last character (the comma).
  } else {
    return str; // Return the original string if no comma is present.
  }
}
function parseLine(line: string) {
  const jsonObjectString = '{' + removeTrailingComma(line) + '}';
  const data = JSON.parse(jsonObjectString);
  const key = Object.keys(data)[0];
  const value = data[key];
  return [key, value];
}

function parseJson(input: string): MultiMap<string, string> {
  const map = new MultiMap<string, string>();
  const lines = input.split('\n').map((e) => e.trim()).filter((e) => e.length > 0);
  const firstLine = lines.shift();
  if (firstLine === '{}') {
    return map;
  }
  if (firstLine !== '{') {
    throw new Error('Expected {, got' + firstLine);
  }
  while (lines.length > 0) {
    let line = lines.shift();
    if (line === undefined) {
      break;
    }
    if (line === '}') {
      if (lines.length > 0) {
        throw new Error('lines available after }');
      }
      break;
    }
    if (line.endsWith(':')) {
      const nextLine = lines.shift();
      line = line + ' ' + nextLine;
    }
    const [key, value] = parseLine(line);
    map.set(key, value);
  }
  return map;
}

const pathToTranslationsDir = path.resolve('src/locales');

let errors = 0;
const dirs = fs.readdirSync(pathToTranslationsDir);
for (const lang of dirs) {
  const localeDir = path.join(pathToTranslationsDir, lang);
  if (lang.length === 2 && fs.statSync(localeDir).isDirectory()) {
    const translationDir = path.resolve(path.join(pathToTranslationsDir, lang));
    const files = fs.readdirSync(translationDir);
    for (const file of files) {
      if (!file.endsWith('.json')) {
        continue;
      }
      const filename = path.join(translationDir, file);
      // console.log('processing ' + filename);
      const content = fs.readFileSync(filename, 'utf8');
      const results = parseJson(content);
      for (const key of results.keys()) {
        if (results.get(key)!.length > 1) { // eslint-disable-line @typescript-eslint/no-non-null-assertion
          const uniqueCount = new Set(results.get(key)).size;
          console.log(filename, '[', uniqueCount, '] [', key, ']');
          errors++;
        }
      }
    }
  }
}

if (errors > 0) {
  console.error('Multiple translation strings in the same file. Stopping.');
  process.exit(1);
}
