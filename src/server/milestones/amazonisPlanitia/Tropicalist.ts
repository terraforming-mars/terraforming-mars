import {IPlayer} from '../../IPlayer';
import {BaseMilestone} from '../IMilestone';
import {Board} from '../../boards/Board';

export class Tropicalist extends BaseMilestone {
  constructor() {
    super(
      'Tropicalist',
      'Own 3 tiles in the middle 3 equatorial rows',
      3);
  }

  public getScore(player: IPlayer): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.y >= 3 && space.y <= 5).length;
  }
}
