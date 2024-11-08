import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {isHazardTileType} from '../../../common/AresTileType';

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

    return player.game.board.spaces.filter((space) =>
      space.player === player &&
      space.tile !== undefined &&
      isHazardTileType(space.tile.tileType) === false &&
      (volcanicSpaceIds.includes(space.id) ||
       board.getAdjacentSpaces(space).some((adjSpace) => volcanicSpaceIds.includes(adjSpace.id))),
    ).length;
  }
}
