import {IPlayer} from '@/server/IPlayer';
import {IAward} from '@/server/awards/IAward';

export class Metropolist implements IAward {
  public readonly name = 'Metropolist';
  public readonly description = 'Own the most cities';
  public getScore(player: IPlayer): number {
    return player.game.board.getCities(player).length;
  }
}
