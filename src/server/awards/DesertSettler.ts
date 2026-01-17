import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';
import {Board} from '@/server/boards/Board';

export class DesertSettler implements IAward {
  public readonly name = 'Desert Settler';
  public readonly description = 'Own the most tiles south of the equator (the four bottom rows)';
  public getScore(player: IPlayer): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.y >= 5 && space.y <= 8)
      .length;
  }
}
