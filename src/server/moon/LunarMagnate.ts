import {IAward} from '../awards/IAward';
import {IPlayer} from '../IPlayer';

export class LunarMagnate implements IAward {
  public readonly name = 'Lunar Magnate';
  public readonly description = 'Own the most tiles on The Moon';
  public getScore(player: IPlayer): number {
    const spaces = player.game.moonData?.moon.spaces ?? [];
    return spaces.filter((space) => {
      return space.player?.id === player.id || space.coOwner?.id === player.id;
    }).length;
  }
}
