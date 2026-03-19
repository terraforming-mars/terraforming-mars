import {DeltaProjectModel} from '../../common/models/DeltaProjectModel';
import {IGame} from '../IGame';

export function createDeltaProjectModel(game: IGame): DeltaProjectModel | undefined {
  if (game.deltaProjectData === undefined) return undefined;
  const data = game.deltaProjectData;
  const players: DeltaProjectModel['players'] = {};
  for (const [color, progress] of data.players) {
    players[color] = {...progress};
  }
  return {players};
}
