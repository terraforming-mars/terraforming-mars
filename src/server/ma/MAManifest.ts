import {BoardName} from '../../common/boards/BoardName';
import {Expansion} from '../../common/cards/GameModule';

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
