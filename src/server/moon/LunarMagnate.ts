import {IAward} from '@/server/awards/IAward';
import {Board} from '@/server/boards/Board';
import {IPlayer} from '@/server/IPlayer';

export class LunarMagnate implements IAward {
  public readonly name = 'Lunar Magnate';
  public readonly description = 'Own the most tiles on The Moon';
  public getScore(player: IPlayer): number {
    const spaces = player.game.moonData?.moon.spaces ?? [];
    return spaces.filter(Board.ownedBy(player)).length;
  }
}
