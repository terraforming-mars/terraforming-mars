// Generates the files settings.json and translations.json, stored in src/genfilesimport * as fs from 'fs';
require('dotenv').config();
import * as fs from 'fs';
import * as child_process from 'child_process';
import * as path from 'path';
import * as constants from '../common/constants';

function mkdirQuietly(path: string) {
  if (!fs.existsSync(path)) {
    fs.mkdirSync(path);
  }
}

function readdir(path: string, predicate: (dirent: string) => boolean) {
  const entries = fs.readdirSync(path);
  return entries.filter(predicate);
}

type Translation = {[lang: string]: string}


/**
 * Reads all the translations in src/locales, and returns a data structure of this
 * structure:
 *
 * {
 *   'Hello' : {
 *     'es': 'Hola',
 *     'de': 'Guten Tag',
 *   },
 * },
 */
function getAllTranslations(): {[lang: string]: Translation} {
  const translationsPath = path.resolve('src/locales');
  const translations: {[lang: string]: Translation} = {};

  const languageDirectories = readdir(
    translationsPath,
    (dirent) => dirent.length === 2 && fs.statSync(path.join(translationsPath, dirent)).isDirectory(),
  );

  for (const lang of languageDirectories) {
    const translationDir = path.resolve(path.join(translationsPath, lang));

    const languageFiles = readdir(
      translationDir,
      (dirent) => dirent.endsWith('.json'),
    );

    for (const file of languageFiles) {
      const filename = path.join(translationDir, file);
      try {
        const content = fs.readFileSync(filename, 'utf8');
        const json = JSON.parse(content);

        for (const phrase of Object.keys(json)) {
          if (translations[phrase] === undefined) {
            translations[phrase] = {};
          }
          if (translations[phrase][lang] !== undefined) {
            console.log(`${lang}: Repeated translation for [${phrase}]`);
          }
          translations[phrase][lang] = json[phrase];
        }
      } catch (e) {
        throw new Error(`While parsing ${filename}:` + e);
      }
    }
  }

  return translations;
}

function getBuildMetadata(): {head: string, date: string} {
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

function writeBuildMetadata() {
  function getEnv(ev: string, dv: number) {
    return process.env[ev] ? Number(process.env[ev]): dv;
  }

  const buildmetadata = getBuildMetadata();
  const settings = {
    head: buildmetadata.head,
    builtAt: buildmetadata.date,
    waitingForTimeout: getEnv('WAITING_FOR_TIMEOUT', constants.DEFAULT_WAITING_FOR_TIMEOUT),
    logLength: getEnv('LOG_LENGTH', constants.DEFAULT_LOG_LENGTH),
    discordClientId: process.env['DISCORD_CLIENT_ID'] ?? '',
  };
  fs.writeFileSync('src/genfiles/settings.json', JSON.stringify(settings));
}

/**
 * Generate translation files in `/assets/locales/*.json` to load them async by the client
 */
function generateTranslations() {
  const localesDir = path.join(process.cwd(), 'src/locales');
  const destinationPath = path.join(process.cwd(), 'assets/locales');

  mkdirQuietly(destinationPath);

  const localesCodes = fs.readdirSync(localesDir);
  localesCodes.forEach((localeCode) => {
    const localeDir = path.join(localesDir, localeCode);
    const localeFiles = fs.readdirSync(localeDir).filter((dirent) => dirent.endsWith('.json'));

    const localeObject = localeFiles.reduce((localeObject, localeFile) => {
      const filePath = path.join(localeDir, localeFile);
      Object.assign(localeObject, require(filePath));
      return localeObject;
    }, {});

    const destinationFile = path.join(destinationPath, `${localeCode}.json`);
    fs.writeFileSync(destinationFile, JSON.stringify(localeObject));
  });
}

function writeTranslations() {
  const translations = getAllTranslations();
  fs.writeFileSync('src/genfiles/translations.json', JSON.stringify(translations));
}

mkdirQuietly('src/genfiles');

writeBuildMetadata();
generateTranslations();
writeTranslations();
