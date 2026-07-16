import {PathfindersModel} from '../../common/models/PathfindersModel';
import {IGame} from '../IGame';

export function createPathfindersModel(game: IGame): PathfindersModel | undefined {
  if (game.pathfindersData === undefined) return undefined;
  const pathfindersData = game.pathfindersData;
  return {
    venus: pathfindersData.venus,
    earth: pathfindersData.earth,
    mars: pathfindersData.mars,
    jovian: pathfindersData.jovian,
    moon: pathfindersData.moon,
  };
}
