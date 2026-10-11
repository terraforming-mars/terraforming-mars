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
    const board = player.game.board;
    return board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.y >= board.equatorRow - 1 && space.y <= board.equatorRow + 1).length;
  }
}
