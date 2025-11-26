import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';

export class CosmicSettler implements IAward {
  public readonly name = 'Cosmic Settler';
  public readonly description = 'Own the most cities not on Mars';
  public getScore(player: IPlayer): number {
    return player.game.board.getCitiesOffMars(player).length;
  }
}
