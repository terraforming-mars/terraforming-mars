import {Color} from '../../common/Color';
import {SerializedDeltaProjectData} from './SerializedDeltaProjectData';

export type DeltaProjectData = {
  playerPositions: Map<Color, number>;
  claimed2VP: Array<Color>;
  claimed5VP: Array<Color>;
  jovianBonus: Array<Color>;
}

export namespace DeltaProjectData {
  export function serialize(data: DeltaProjectData | undefined): SerializedDeltaProjectData | undefined {
    if (data === undefined) {
      return undefined;
    }
    return {
      playerPositions: Object.fromEntries(data.playerPositions),
      claimed2VP: [...data.claimed2VP],
      claimed5VP: [...data.claimed5VP],
      jovianBonus: [...data.jovianBonus],
    };
  }

  export function deserialize(data: SerializedDeltaProjectData): DeltaProjectData {
    return {
      playerPositions: new Map(Object.entries(data.playerPositions)) as Map<Color, number>,
      claimed2VP: [...data.claimed2VP],
      claimed5VP: [...data.claimed5VP],
      jovianBonus: [...data.jovianBonus],
    };
  }
}
