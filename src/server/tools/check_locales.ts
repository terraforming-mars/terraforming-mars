import path from 'path';
import fs from 'fs';
import raw_translations from '../../genfiles/translations.json';

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
} else if (args[0] !== undefined) {
  console.error(`invalid arg ${args[0]}`);
  process.exit(1);
}

for (const [sourceString, translations] of Object.entries(raw_translations)) {
  const missingLocales: Array<string> = [];
  for (const localeName of localesToWarn) {
    const trans: string = (translations as any)[localeName];
    if (!trans) {
      missingLocales.push(localeName);
    }
  }
  if (missingLocales.length > 0) {
    console.log('"' + sourceString + '": "' + missingLocales + '"');
  }
}
