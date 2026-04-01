import {LANGUAGE} from '@/common/constants';

export const GAME_LOCALE_TO_BCP47: Record<LANGUAGE, string> = {
  br: 'pt-BR',
  cn: 'zh',
  jp: 'ja',
  ua: 'uk',
  en: 'en',
  de: 'de',
  fr: 'fr',
  ru: 'ru',
  pl: 'pl',
  es: 'es',
  it: 'it',
  ko: 'ko',
  nl: 'nl',
  hu: 'hu',
  bg: 'bg',
  nb: 'nb',
  fi: 'fi',
};

export function gameLocaleToIntlLocale(lang: string): string {
  return GAME_LOCALE_TO_BCP47[lang as LANGUAGE] ?? lang;
}
