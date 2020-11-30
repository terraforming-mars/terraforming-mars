
import {PreferencesManager} from '../components/PreferencesManager';
import * as raw_translations from '../../assets/translations.json';

const TM_translations: {[x: string]: {[x: string]: string}} = raw_translations;

function translateThroughRegExp(englishText: string, language: string): string | undefined {
  for (const translation of Object.keys(TM_translations)) {
    if (translation.indexOf('{{d}}') !== -1) {
      const re = new RegExp(translation.replace('{{d}}', '(\\d+)'));
      if (re.test(englishText)) {
        const languages = TM_translations[translation];
        if (languages !== undefined && languages[language] !== undefined) {
          return englishText.replace(re, languages[language]);
        }
      }
    }
  }
  return undefined;
}

export function translateText(englishText: string): string {
  let translatedText = englishText;
  const lang = PreferencesManager.loadValue('lang') || 'en';
  if (lang === 'en') return englishText;

  englishText = normalizeText(englishText);

  // direct match
  const languages = TM_translations[englishText];
  if (languages !== undefined && languages[lang] !== undefined) {
    return languages[lang];
  }

  // match through RegExp
  const regMatch = translateThroughRegExp(englishText, lang);
  if (regMatch !== undefined) {
    return regMatch;
  }

  let stripedText = englishText.replace(/^\((.*)\)$/gm, '$1');
  if (stripedText && stripedText !== englishText) {
    stripedText = translateText(stripedText);
    if (stripedText !== englishText) {
      translatedText = '(' + stripedText + ')';
    }
  } else if (stripedText && stripedText.length > 3) {
    console.log('Please translate "' + stripedText + '"');
  }
  return translatedText;
}

function normalizeText(text: string): string {
  return text.replace(/[\n\r]/g, '').replace(/[ ]+/g, ' ').trim();
}

function translateChildren(node: Node) {
  for (let i = 0, length = node.childNodes.length; i < length; i++) {
    const child = node.childNodes[i];
    if (child.nodeType === Node.TEXT_NODE) {
      const text = child as Text;
      const translatedText = translateText(text.data);
      if (translatedText !== text.data) {
        text.data = translatedText;
      }
    } else {
      translateChildren(child);
    }
  }
}

export function translateTextNode(el: HTMLElement) {
  translateChildren(el);
}

export const $t = translateText;
