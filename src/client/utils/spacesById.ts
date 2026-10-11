import {toRaw} from 'vue';
import {SpaceModel} from '@/common/models/SpaceModel';
import {SpaceId} from '@/common/Types';

// Space arrays arrive fresh with each view model and are never mutated,
// so the array's identity is a safe cache key.
const cache = new WeakMap<ReadonlyArray<SpaceModel>, Map<SpaceId, SpaceModel>>();

export function spacesById(spaces: ReadonlyArray<SpaceModel>): Map<SpaceId, SpaceModel> {
  const raw = toRaw(spaces);
  let map = cache.get(raw);
  if (map === undefined) {
    map = new Map(raw.map((space) => [space.id, space]));
    cache.set(raw, map);
  }
  return map;
}
