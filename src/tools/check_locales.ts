import * as path from 'path';
import * as fs from 'fs';
import * as raw_translations from '../../assets/translations.json';

const LOCALES_DIR = path.resolve('./src/locales/');
const locales: Array<string> = [];

fs.readdirSync(LOCALES_DIR).forEach((localeName) => {
  locales.push(localeName);
});

const args = process.argv.slice(2);
let localesToWarn = locales;
if (args) {
  const localeArgPos = args.indexOf('--locale');
  if (localeArgPos !== -1 && args.length > localeArgPos+1) {
    const warnLocale = args[localeArgPos+1].toLowerCase();
    if ( ! locales.includes(warnLocale)) {
      console.log('Wrong ' + warnLocale + ' --locale provided');
      process.exit(1);
    }
    localesToWarn = [warnLocale];
  }
}


let sourceString: keyof typeof raw_translations;
let warnings: Array<string>;

for (sourceString in raw_translations) {
  if ( ! raw_translations.hasOwnProperty(sourceString)) continue;
  const translations = raw_translations[sourceString];
  warnings = [];
  for (const localeName of localesToWarn) {
    const trans: string = (translations as any)[localeName];
    if ( ! trans && localeName === 'ru') {
      warnings.push('\tmissing ' + localeName);
    }
  }
  if (warnings.length > 0) {
    console.log(sourceString);
    for (const warning of warnings) {
      console.log(warning);
    }
  }
}
