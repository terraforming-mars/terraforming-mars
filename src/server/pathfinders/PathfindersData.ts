import {Tag} from '../../common/cards/Tag';
import {PlayerId} from '../../common/Types';
import {PlanetaryTag} from './PathfindersExpansion';
import {SerializedPathfindersData} from './SerializedPathfindersData';

export type PathfindersData = Record<PlanetaryTag, number> & {
  vps: Array<{id: PlayerId, tag: Tag, points: number}>;
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
