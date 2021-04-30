
import {LogMessageDataType} from '../LogMessageDataType';
import {Message} from '../Message';
import {PreferencesManager} from '../components/PreferencesManager';
import * as raw_translations from '../genfiles/translations.json';
import {LogMessageData} from '../LogMessageData';

const TM_translations: {[x: string]: {[x: string]: string}} = raw_translations;

export function translateMessage(message: Message): string {
  return translateText(message.message).replace(/\$\{([0-9]{1})\}/gi, (_match, idx) => {
    if (message.data[idx] !== undefined && message.data[idx].type === LogMessageDataType.RAW_STRING) {
      return message.data[idx].value;
    }
    return '';
  });
}

export function translateText(englishText: string): string {
  let translatedText = englishText;
  const lang = PreferencesManager.load('lang') || 'en';
  if (lang === 'en') return englishText;

  englishText = normalizeText(englishText);

  const languages = TM_translations[englishText];

  if (languages !== undefined && languages[lang] !== undefined) {
    translatedText = languages[lang];
  } else {
    let stripedText = englishText.replace(/^\((.*)\)$/gm, '$1');
    if (stripedText && stripedText !== englishText) {
      stripedText = translateText(stripedText);
      if (stripedText !== englishText) {
        translatedText = '(' + stripedText + ')';
      }
    } else if (stripedText && stripedText.length > 3) {
      console.log('Please translate "' + stripedText + '"');
    }
  }
  return translatedText;
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
  if ( ! msg) return '';
  if (typeof(msg) === 'number') return msg.toString();
  if (typeof msg === 'string') {
    return translateText(msg);
  }
  return translateMessage(msg);
};
