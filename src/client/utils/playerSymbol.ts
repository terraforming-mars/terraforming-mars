import {getPreferences} from '@/client/utils/PreferencesManager';
import {Color} from '@/common/Color';

export const SYMBOL_FOR_COLOR: Record<Color, string> = {
  red: '▲',
  blue: '+',
  black: '∇',
  yellow: '∗',
  green: '◆',
  purple: '◉',
  orange: '▢',
  pink: '◈',
  bronze: '▦',
  neutral: '★',
} as const;

export function playerSymbol(color: Color, optionalSuffix: string = '') {
  if (getPreferences().symbol_overlay) {
    return SYMBOL_FOR_COLOR[color] + optionalSuffix;
  }
  return '';
}
