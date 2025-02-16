import {BoardName} from '../../common/boards/BoardName';
import {Expansion} from '../../common/cards/GameModule';
import {OneOrArray} from '../../common/utils/types';

type MAManifestSpec<V> = {
  // Creates a new instance of this Milestone or Award.
  Factory: new () => V;
  compatibility?: OneOrArray<Expansion>;
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
