import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {isHazardTileType} from '../../common/AresTileType';
import {Board} from '../boards/Board';

export class EstateDealer implements IAward {
  public readonly name = 'Estate Dealer';
  public readonly description = 'Own the most tiles adjacent to ocean tiles';
  public getScore(player: IPlayer): number {
    return player.game.board.spaces.filter((space) =>
      space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
    ).length;
  }
}
