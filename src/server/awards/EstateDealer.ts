import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {Board} from '@/server/boards/Board';

export class EstateDealer implements IAward {
  public readonly name = 'Estate Dealer';
  public readonly description = 'Own the most tiles adjacent to ocean tiles';
  public getScore(player: IPlayer): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile).filter(
        (space) =>
          player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
      ).length;
  }
}
