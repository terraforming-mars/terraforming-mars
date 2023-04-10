import {PlayerId} from '../../common/Types';
import {Tag} from '../../common/cards/Tag';
import {SerializedPathfindersData} from './SerializedPathfindersData';

/**
 * The possible tags with planetary tracks.
 *
 * The order of this list matches the order of the list displayed in the UI.
 */
export const PLANETARY_TAGS = [Tag.VENUS, Tag.EARTH, Tag.MARS, Tag.JOVIAN, Tag.MOON] as const;
export type PlanetaryTag = typeof PLANETARY_TAGS[number];


export function isPlanetaryTag(tag: Tag): tag is PlanetaryTag {
  return PLANETARY_TAGS.includes(tag as PlanetaryTag);
}

export type PathfindersData = Record<PlanetaryTag, number> & {
  vps: Array<{id: PlayerId, tag: PlanetaryTag, points: number}>;
}

export namespace PathfindersData {
  export function serialize(pathfindersData: PathfindersData | undefined): SerializedPathfindersData | undefined {
    if (pathfindersData === undefined) {
      return undefined;
    }
    return {
      venus: pathfindersData.venus,
      earth: pathfindersData.earth,
      mars: pathfindersData.mars,
      jovian: pathfindersData.jovian,
      moon: pathfindersData.moon,
      vps: pathfindersData.vps,
    };
  }

  export function deserialize(pathfindersData: SerializedPathfindersData): PathfindersData {
    return {
      venus: pathfindersData.venus,
      earth: pathfindersData.earth,
      mars: pathfindersData.mars,
      jovian: pathfindersData.jovian,
      moon: pathfindersData.moon,
      vps: pathfindersData.vps,
    };
  }
}
