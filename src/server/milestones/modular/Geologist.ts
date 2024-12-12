import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {Board} from '../../boards/Board';

export class Geologist extends BaseMilestone {
  constructor() {
    super(
      'Geologist',
      'Own 3 tiles ON or ADJACENT to volcanic areas',
      3,
    );
  }

  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const volcanicSpaceIds = board.volcanicSpaceIds;

    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) =>
        volcanicSpaceIds.includes(space.id) ||
       board.getAdjacentSpaces(space).some((adjSpace) => volcanicSpaceIds.includes(adjSpace.id)),
      ).length;
  }
}
