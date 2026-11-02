import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';

export class Geologist extends BaseMilestone {
  public readonly automaDescription = '3+ tiles on or next to volcanic areas';
  constructor() {
    super(
      'Geologist',
      'Own 3 tiles ON or ADJACENT to volcanic areas',
      3,
    );
  }

  public getScore(player: IPlayer): number {
    const board = player.game.board;

    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => space.volcanic === true ||
           board.getAdjacentSpaces(space).some((adjSpace) => adjSpace.volcanic === true),
      ).length;
  }
}
