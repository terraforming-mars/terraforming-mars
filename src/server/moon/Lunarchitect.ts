import {BaseMilestone} from '../milestones/IMilestone';
import {Player} from '../Player';
import {MoonExpansion} from './MoonExpansion';

export class Lunarchitect extends BaseMilestone {
  constructor() {
    super(
      'Lunarchitect',
      // The original rules had "Own at least 4 Moon tiles" but that
      // was before the moon got 50% bigger.
      'Own 6 Moon tiles',
      6);
  }

  public getScore(player: Player): number {
    return MoonExpansion.ifElseMoon(player.game, (moonData) => {
      return moonData.moon.spaces.filter((space) => space.player?.id === player.id).length;
    }, () => 0) || 0;
  }
}
