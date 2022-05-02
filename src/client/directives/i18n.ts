import {LogMessageDataType} from '@/common/logs/LogMessageDataType';
import {Message} from '@/common/logs/Message';
import {getPreferences} from '@/client/utils/PreferencesManager';
import {LogMessageData} from '@/common/logs/LogMessageData';
import {Log} from '@/common/logs/Log';

export function translateMessage(message: Message): string {
  message.message = translateText(message.message);
  return Log.applyData(message, (datum) => {
    if (datum !== undefined && datum.type === LogMessageDataType.RAW_STRING) {
      return datum.value;
    }
    return '';
  });
}

let translated: Set<string> | undefined;
export function translateText(englishText: string): string {
  const lang = getPreferences().lang;
  const translations: {[key: string]: string} | undefined = (window as any)._translations;
  if (lang === 'en' || translations === undefined) {
    return englishText;
  }

  englishText = normalizeText(englishText);

  // Don't translate non-word strings
  if (/^(\W|\d)*$/.test(englishText)) {
    return englishText;
  }

  let translatedText = translations[englishText];

  // Check if translated word is in brackets
  if (translatedText === undefined) {
    const isTextInBrackets = englishText.startsWith('(') && englishText.endsWith(')');

    if (isTextInBrackets) {
      const translationAttempt = translations[englishText.slice(1, -1)];
      if (translationAttempt) {
        translatedText = `(${translationAttempt})`;
      }
    }
  }

  if (translatedText === undefined) {
  // The i18n plugin sends translated strings back here. That means that sometimes this tries to
  // Since the phrase it sends is not English, it can't be found, and this reports an error to the
  // browser.
  //
  // This Set reduces that by seeing if the string is of the new language, and ignores reporting the error.
    if (translated === undefined) {
      translated = new Set();
      for (const k in translations) {
        if (translations.hasOwnProperty(k)) translated.add(translations[k]);
      }
    }
    if (!translated.has(englishText)) {
      console.log(`${lang} - please translate: ${englishText}`);
    }
  }

  return translatedText || englishText;
}

export function translateTextWithParams(englishText: string, params: Array<string>): string {
  const data = params.map((p) => {
    return {
      type: LogMessageDataType.RAW_STRING,
      value: p,
    } as LogMessageData;
  });

  const message: Message = {
    message: englishText,
    data: data,
  };

  return translateMessage(message);
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

export const $t = function(msg: string | Message | number | undefined) {
  if (!msg) return '';
  if (typeof msg === 'number') return msg.toString();
  if (typeof msg === 'string') return translateText(msg);
  return translateMessage(msg);
};
