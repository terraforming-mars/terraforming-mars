import {BaseMilestone} from '../milestones/IMilestone';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';

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
      return player.game.moonData.moon.spaces.filter((space) => Board.spaceOwnedBy(space, player)).length;
    }
    return 0;
  }
}
