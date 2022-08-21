import {Tag} from '../../common/cards/Tag';
import {PlayerId} from '../../common/Types';
import {SerializedPathfindersData} from './SerializedPathfindersData';

export type PathfindersData = {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
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

  export function getValue(pathfindersData: PathfindersData, tag: Tag): number {
    switch (tag) {
    case Tag.VENUS:
      return pathfindersData.venus;
    case Tag.EARTH:
      return pathfindersData.earth;
    case Tag.MARS:
      return pathfindersData.mars;
    case Tag.JOVIAN:
      return pathfindersData.jovian;
    case Tag.MOON:
      return pathfindersData.moon;
    default:
      return -1;
    }
  }

  export function setValue(pathfindersData: PathfindersData, tag: Tag, value: number): void {
    switch (tag) {
    case Tag.VENUS:
      pathfindersData.venus = value;
      break;
    case Tag.EARTH:
      pathfindersData.earth = value;
      break;
    case Tag.MARS:
      pathfindersData.mars = value;
      break;
    case Tag.JOVIAN:
      pathfindersData.jovian = value;
      break;
    case Tag.MOON:
      pathfindersData.moon = value;
      break;
    }
  }


}
