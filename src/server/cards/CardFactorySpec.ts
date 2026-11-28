import {Expansion} from '@/common/cards/GameModule';
import {OneOrArray} from '../../common/utils/types';
import {asArray} from '../../common/utils/utils';
import {GameOptions} from '../game/GameOptions';

/**
 * Defines conditions for creating a card in a game, including conditions
 * when it will be included in a game.
 */
export type CardFactorySpec<T> = {
  // Creates a new instance of this card.
  Factory: new () => T;
  // Returns the required modules for this card.
  compatibility?: OneOrArray<Expansion>;
  // False when the card should not be instantiated. It's reserved for fake and proxy cards.
  instantiate?: boolean;
  // Used for Turmoil's global events. When true, classified as a "negative" global event.
  negative?: boolean;
}

export function isCompatibleWith(cf: CardFactorySpec<unknown>, gameOptions: GameOptions): boolean {
  if (cf.compatibility === undefined) {
    return true;
  }
  return asArray(cf.compatibility).every((expansion) => gameOptions.expansions[expansion]);
}
