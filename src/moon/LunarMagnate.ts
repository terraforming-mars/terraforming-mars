import {IAward} from '../awards/IAward';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class LunarMagnate implements IAward {
    public name: string = 'Lunar Magnate';
    public description: string = 'Owning the most tiles on The Moon.'
    public getScore(player: Player): number {
      return MoonExpansion.ifMoon(player.game, (moonData) => {
        return moonData.moon.spaces.filter((space) => space.player?.id === player.id).length;
      }, () => 0) || 0;
    }
}
// c2. Awards
// Fullmoon: Have the most number of moon tags played.
