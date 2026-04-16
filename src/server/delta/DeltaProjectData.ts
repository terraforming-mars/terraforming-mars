import {Color} from '../../common/Color';
import {DeltaProjectModel, DeltaProjectPlayerModel} from '../../common/models/DeltaProjectModel';

export type DeltaProjectData = {
  players: Map<Color, DeltaProjectPlayerModel>;
}

export namespace DeltaProjectData {
  export function serialize(data: DeltaProjectData | undefined): DeltaProjectModel | undefined {
    if (data === undefined) {
      return undefined;
    }
    const players: DeltaProjectModel['players'] = {};
    for (const [color, progress] of data.players) {
      players[color] = progress;
    }
    return {players};
  }

  export function deserialize(data: DeltaProjectModel): DeltaProjectData {
    const players = new Map<Color, DeltaProjectPlayerModel>();
    for (const [color, progress] of Object.entries(data.players)) {
      if (progress === undefined) continue;
      players.set(color as Color, progress);
    }
    return {players};
  }
}
