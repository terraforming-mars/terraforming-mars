import {APP_NAME} from '@/common/constants';
import {$t} from '../directives/i18n';

export function setDocumentTitle(title?: string): void {
  if (title === undefined) {
    document.title = $t(APP_NAME);
  } else {
    document.title = `${title} | $t(${APP_NAME})`;
  }
}

export function gameDocumentTitle(game: {name: string}): string {
  return `${game.name} | ${APP_NAME}`;
}
