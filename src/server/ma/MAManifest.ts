import {BoardName} from '../../common/boards/BoardName';
import {Expansion, EXPANSIONS} from '../../common/cards/GameModule';
import {GameOptions} from '../game/GameOptions';

type MAManifestSpec<V> = {
  // Creates a new instance of this Milestone or Award.
  Factory: new () => V;
  compatibility?: Expansion | undefined;
}
type ExpansionsWithMAs = 'venus' | 'ares' | 'moon' | 'underworld';

export type MAManifest<K extends string, V> = {
  all: Record<K, MAManifestSpec<V>>,
  boards: Record<BoardName, ReadonlyArray<K>>,
  expansions: Record<ExpansionsWithMAs, ReadonlyArray<K>>;
  modular: ReadonlyArray<K>;
  create(name: string): V | undefined;
  createOrThrow(name: string): V;
}

export function isCompatible<T extends string>(name: T, manifest: MAManifest<T, any>, gameOptions: GameOptions) {
  const mapping: Record<Expansion, keyof GameOptions> = {
    corpera: 'corporateEra',
    promo: 'promoCardsOption',
    venus: 'venusNextExtension',
    colonies: 'coloniesExtension',
    prelude: 'preludeExtension',
    prelude2: 'prelude2Expansion',
    turmoil: 'turmoilExtension',
    community: 'communityCardsOption',
    ares: 'aresExtension',
    moon: 'moonExpansion',
    pathfinders: 'pathfindersExpansion',
    ceo: 'ceoExtension',
    starwars: 'starWarsExpansion',
    underworld: 'underworldExpansion',
  };
  for (const expansion of EXPANSIONS) {
    if (manifest.all[name].compatibility === expansion) {
      if (gameOptions[mapping[expansion]] !== true) {
        return false;
      }
    }
  }
  return true;
}
