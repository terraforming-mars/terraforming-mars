import {IAward} from './IAward';
import {Player} from '../Player';
import {playerTileFn} from '../boards/Board';
import {TileType} from '../common/TileType';
import {SpaceType} from '../common/boards/SpaceType';

export class CosmicSettler implements IAward {
  public name: string = 'Cosmic Settler';
  public description: string = 'Having the most city tiles not on Mars';
  public getScore(player: Player): number {
    return player.game.board.spaces
      .filter((space) => space.tile?.tileType === TileType.CITY)
      .filter((space) => space.spaceType === SpaceType.COLONY)
      .filter(playerTileFn(player))
      .length;
  }
}
