import {IAward} from '../awards/IAward';
import {IPlayer} from '../IPlayer';
import {MoonExpansion} from './MoonExpansion';

export class LunarMagnate implements IAward {
  public readonly name = 'Lunar Magnate';
  public readonly description = 'Own the most tiles on The Moon';
  public getScore(player: IPlayer): number {
    return MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces.filter((space) => space.player?.id === player.id).length;
    }, () => 0) || 0;
  }
}
