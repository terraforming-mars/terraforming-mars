import {IAward} from '../awards/IAward';
import {IPlayer} from '../IPlayer';
import {MoonExpansion} from './MoonExpansion';

export class LunarMagnate implements IAward {
  public readonly name = 'Lunar Magnate';
  public readonly description = 'Own the most tiles on The Moon';
  public getScore(player: IPlayer): number {
    const spaces = MoonExpansion.ifElseMoon(player.game, (moonData) => moonData.moon.spaces, () => []);
    return spaces.filter((space) => {
      return space.player?.id === player.id || space.coOwner?.id === player.id;
    }).length;
  }
}
