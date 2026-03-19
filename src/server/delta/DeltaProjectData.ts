import {Color} from '../../common/Color';
import {SerializedDeltaProjectData, SerializedDeltaPlayerProgress} from './SerializedDeltaProjectData';

export type DeltaPlayerProgress = {
  position: number;
  claimed2VP: boolean;
  claimed5VP: boolean;
  jovianBonus: boolean;
}

export type DeltaProjectData = {
  players: Map<Color, DeltaPlayerProgress>;
}

export namespace DeltaProjectData {
  export function serialize(data: DeltaProjectData | undefined): SerializedDeltaProjectData | undefined {
    if (data === undefined) {
      return undefined;
    }
    const players: Partial<Record<Color, SerializedDeltaPlayerProgress>> = {};
    for (const [color, progress] of data.players) {
      players[color] = {...progress};
    }
    return {players};
  }

  export function deserialize(data: SerializedDeltaProjectData): DeltaProjectData {
    const players = new Map<Color, DeltaPlayerProgress>();
    for (const [color, progress] of Object.entries(data.players)) {
      players.set(color as Color, {...progress!});
    }
    return {players};
  }
}
