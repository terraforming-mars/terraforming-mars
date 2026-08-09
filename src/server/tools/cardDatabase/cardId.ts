import {CardName} from '@/common/cards/CardName';

/**
 * Returns a stable, lowercase, underscore-separated identifier for a card.
 *
 * Card names are display strings, so they contain spaces, punctuation and
 * decorations like ':SP'. The identifier strips all of that, leaving something
 * safe to use as a JSON key, a filename, or a URL fragment.
 */
export function cardId(name: CardName): string {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '_')
    .replace(/^_+/, '')
    .replace(/_+$/, '');
}
