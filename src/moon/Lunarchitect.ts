import {IMilestone} from '../milestones/IMilestone';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class Lunarchitect implements IMilestone {
  public name: string = 'Lunarchitect';
  // The original rules had "Own at least 4 Moon tiles" but that
  // was before the moon got 50% bigger.

  public description: string = 'Own at least 6 Moon tiles';
  public getScore(player: Player): number {
    return MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces.filter((space) => space.player?.id === player.id).length;
    }, () => 0) || 0;
  }
  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 6;
  }
}
