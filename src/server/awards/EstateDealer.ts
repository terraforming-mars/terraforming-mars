import {IAward} from './IAward';
import {Player} from '../Player';
import {isHazardTileType} from '../../common/TileType';
import {Board} from '../boards/Board';

export class EstateDealer implements IAward {
  public readonly name = 'Estate Dealer';
  public readonly description = 'Most tiles adjacent to ocean tiles';
  public getScore(player: Player): number {
    return player.game.board.spaces.filter((space) =>
      space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
    ).length;
  }
}
