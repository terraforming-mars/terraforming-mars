import {BaseMilestone} from '../milestones/IMilestone';
import {IPlayer} from '../IPlayer';

export class Lunarchitect extends BaseMilestone {
  constructor() {
    super(
      'Lunarchitect',
      // The original rules had "Own at least 4 Moon tiles" but that
      // was before the moon got 50% bigger.
      'Own 6 Moon tiles',
      6);
  }

  public getScore(player: IPlayer): number {
    if (player.game.moonData) {
      return player.game.moonData.moon.spaces.filter((space) => space.player?.id === player.id || space.coOwner?.id === player.id).length;
    }
    return 0;
  }
}
