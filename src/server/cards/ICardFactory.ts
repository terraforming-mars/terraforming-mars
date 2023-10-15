import {GameModule} from '../../common/cards/GameModule';
import {OneOrArray} from '../../common/utils/types';
import {asArray} from '../../common/utils/utils';
import {GameOptions} from '../game/GameOptions';

export interface ICardFactory<T> {
  // Creates a new instance of this ard.
  Factory: new () => T;
  // Returns the required modules for this card.
  compatibility?: OneOrArray<GameModule>;
  // False when the card should not be instantiated. It's reserved for fake and proxy cards.
  instantiate?: boolean;
  // Used for Turmoil's global events. When true, classifeid as a "negative" global event.
  negative?: boolean;
}

export function isCompatibleWith(cf: ICardFactory<any>, gameOptions: GameOptions): boolean {
  if (cf.compatibility === undefined) {
    return true;
  }
  const expansions: Array<GameModule> = asArray(cf.compatibility);
  return expansions.every((expansion) => {
    switch (expansion) {
    case 'venus':
      return gameOptions.venusNextExtension;
    case 'colonies':
      return gameOptions.coloniesExtension;
    case 'turmoil':
      return gameOptions.turmoilExtension;
    case 'prelude':
      return gameOptions.preludeExtension;
    case 'prelude2':
      return gameOptions.prelude2Expansion;
    case 'moon':
      return gameOptions.moonExpansion;
    case 'pathfinders':
      return gameOptions.pathfindersExpansion;
    case 'ares':
      return gameOptions.aresExtension;
    case 'ceo':
      return gameOptions.ceoExtension;
    case 'starwars':
      return gameOptions.starWarsExpansion;
    }
    throw new Error(`Unhandled expansion type ${expansion}`);
  });
}
