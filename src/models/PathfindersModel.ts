import {Game} from '../Game';

export interface PathfindersModel {
  venus: number;
  earth: number;
  mars: number;
  jovian: number;
  moon: number;
}

export namespace PathfindersModel {
  export function serialize(game: Game): PathfindersModel | undefined {
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
}
