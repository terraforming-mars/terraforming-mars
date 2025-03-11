// Generates the files settings.json and translations.json, stored in src/genfilesimport * as fs from 'fs';
require('dotenv').config();
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';

type Translation = {[lang: string]: string}
function getAllTranslations(): {[key: string]: Translation} {
  const pathToTranslationsDir = path.resolve('src/locales');
  const translations: {[key: string]: Translation}= {};

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
        try {
          const content = fs.readFileSync(filename, 'utf8');
          const json = JSON.parse(content);

          for (const phrase of Object.keys(json)) {
            if (translations[phrase] === undefined) {
              translations[phrase] = {};
            }
            // if (translations[phrase][lang] !== undefined) {
            //   console.log(`${lang}: Repeated translation for [${phrase}]`);
            // }
            translations[phrase][lang] = json[phrase];
          }
        } catch (e) {
          throw new Error(`While parsing ${filename}:` + e);
        }
      }
    }
  }

  return translations;
}

function getBuildMetadata() /* {head: string, date: string} */ {
  // assumes SOURCE_VERSION is git hash
  if (process.env.SOURCE_VERSION) {
    return {
      head: process.env.SOURCE_VERSION.substring(0, 7),
      date: new Date().toUTCString().replace(/ \(.+\)/, ''),
    };
  }
  try {
    const output = child_process.execSync(`git log -1 --pretty=format:"%h %cD"`).toString();
    const [head, ...rest] = output.split(' ');
    return {head, date: rest.join(' ')};
  } catch (error) {
    console.error('unable to generate app version', error);
    return {head: 'n/a', date: 'n/a'};
  }
}

function getWaitingForTimeout() {
  if (process.env.WAITING_FOR_TIMEOUT) {
    return Number(process.env.WAITING_FOR_TIMEOUT);
  }
  return 1000;
}

function getLogLength() {
  if (process.env.LOG_LENGTH) {
    return Number(process.env.LOG_LENGTH);
  }
  return 50;
}

if (!fs.existsSync('src/genfiles')) {
  fs.mkdirSync('src/genfiles');
}

const buildmetadata = getBuildMetadata();
fs.writeFileSync('src/genfiles/settings.json', JSON.stringify({
  head: buildmetadata.head,
  builtAt: buildmetadata.date,
  waitingForTimeout: getWaitingForTimeout(),
  logLength: getLogLength(),
}));

fs.writeFileSync('src/genfiles/translations.json', JSON.stringify(
  getAllTranslations(),
));

/**
 * Generate translation files in `/assets/locales/*.json` to load them async by the client
 */
function generateTranslations() {
  const localesDir = path.join(process.cwd(), 'src/locales');
  const localesCodes = fs.readdirSync(localesDir);
  const destinationPath = path.join(process.cwd(), 'assets/locales');

  if (!fs.existsSync(destinationPath)) {
    fs.mkdirSync(destinationPath);
  }

  const isJSONExt = (fileName: string) => fileName.endsWith('.json');

  localesCodes.forEach((localeCode) => {
    const localeDir = path.join(localesDir, localeCode);
    const localeFiles = fs.readdirSync(localeDir).filter(isJSONExt);

    const localeObject = localeFiles.reduce((localeObject, localeFile) => {
      const filePath = path.join(localeDir, localeFile);
      Object.assign(localeObject, require(filePath));
      return localeObject;
    }, {});

    const destinationFile = path.join(destinationPath, `${localeCode}.json`);
    fs.writeFileSync(destinationFile, JSON.stringify(localeObject));
  });
}

generateTranslations();
