import {DeltaProjectModel} from '../../common/models/DeltaProjectModel';
import {IGame} from '../IGame';

export function createDeltaProjectModel(game: IGame): DeltaProjectModel | undefined {
  if (game.deltaProjectData === undefined) return undefined;
  const data = game.deltaProjectData;
  return {
    playerPositions: Object.fromEntries(data.playerPositions),
    claimed2VP: [...data.claimed2VP],
    claimed5VP: [...data.claimed5VP],
    jovianBonus: [...data.jovianBonus],
  };
}
