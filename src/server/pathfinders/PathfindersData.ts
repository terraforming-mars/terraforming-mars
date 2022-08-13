import {Tags} from '../../common/cards/Tags';
import {PlayerId} from '../../common/Types';
import {SerializedPathfindersData} from './SerializedPathfindersData';

export type PathfindersData = {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
  vps: Array<{id: PlayerId, tag: Tags, points: number}>;
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

  export function getValue(pathfindersData: PathfindersData, tag: Tags): number {
    switch (tag) {
    case Tags.VENUS:
      return pathfindersData.venus;
    case Tags.EARTH:
      return pathfindersData.earth;
    case Tags.MARS:
      return pathfindersData.mars;
    case Tags.JOVIAN:
      return pathfindersData.jovian;
    case Tags.MOON:
      return pathfindersData.moon;
    default:
      return -1;
    }
  }

  export function setValue(pathfindersData: PathfindersData, tag: Tags, value: number): void {
    switch (tag) {
    case Tags.VENUS:
      pathfindersData.venus = value;
      break;
    case Tags.EARTH:
      pathfindersData.earth = value;
      break;
    case Tags.MARS:
      pathfindersData.mars = value;
      break;
    case Tags.JOVIAN:
      pathfindersData.jovian = value;
      break;
    case Tags.MOON:
      pathfindersData.moon = value;
      break;
    }
  }


}
