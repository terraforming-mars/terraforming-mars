import {BoardName} from '../../common/boards/BoardName';
import {Expansion, EXPANSIONS} from '../../common/cards/GameModule';
import {GameOptions} from '../game/GameOptions';

type MAManifestSpec<V> = {
  /** Constructor that a new instance of this MA. */
  Factory: new () => V;
  /** If set, the module this MA needs to function. */
  compatibility?: Expansion;
  /** When true, do not include in any new games when picking randomly. */
  deprecated?: true;
  random?: 'modular' | 'both';
}
type ExpansionsWithMAs = 'venus' | 'ares' | 'moon' | 'underworld';

export type MAManifest<K extends string, V> = {
  all: Record<K, MAManifestSpec<V>>,
  boards: Record<BoardName, ReadonlyArray<K>>,
  expansions: Record<ExpansionsWithMAs, ReadonlyArray<K>>;
  create(name: string): V | undefined;
  createOrThrow(name: string): V;
}

export function isCompatible<T extends string>(name: T, manifest: MAManifest<T, any>, gameOptions: GameOptions) {
  for (const expansion of EXPANSIONS) {
    if (manifest.all[name].compatibility === expansion) {
      if (gameOptions.expansions[expansion] !== true) {
        return false;
      }
    }
  }
  return true;
}
