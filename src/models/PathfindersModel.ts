import {PathfindersModel} from '../common/models/PathfindersModel';
import {Game} from '../Game';

export function createPathfindersModel(game: Game): PathfindersModel | undefined {
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
