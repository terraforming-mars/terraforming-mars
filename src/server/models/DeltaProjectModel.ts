import {DeltaProjectModel} from '../../common/models/DeltaProjectModel';
import {DeltaProjectData} from '../delta/DeltaProjectData';
import {IGame} from '../IGame';

export function createDeltaProjectModel(game: IGame): DeltaProjectModel | undefined {
  return DeltaProjectData.serialize(game.deltaProjectData);
}
