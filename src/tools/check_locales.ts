import * as path from 'path';
import * as fs from 'fs';
import * as raw_translations from '../genfiles/translations.json';

const LOCALES_DIR = path.resolve('./src/locales/');
const locales: Array<string> = [];

fs.readdirSync(LOCALES_DIR).forEach((localeName) => {
  locales.push(localeName);
});

const args = process.argv.slice(2);
let localesToWarn = locales;

if (args[0] === '--locales') {
  localesToWarn = args[1].split(',');
  localesToWarn.forEach((locale) => {
    if ( ! locales.includes(locale)) {
      console.error(`Invalid locale ${locale}`);
      process.exit(1);
    }
  });
}

let sourceString: keyof typeof raw_translations;
let warnings: Array<string>;

for (sourceString in raw_translations) {
  if ( ! raw_translations.hasOwnProperty(sourceString)) continue;
  const translations = raw_translations[sourceString];
  warnings = [];
  for (const localeName of localesToWarn) {
    const trans: string = (translations as any)[localeName];
    if ( ! trans) {
      warnings.push('\tmissing ' + localeName);
    }
  }
  if (warnings.length > 0) {
    console.log(sourceString);
    console.warn(warnings.join('\n'));
  }
}
