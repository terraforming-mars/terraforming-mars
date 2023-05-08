import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {Board} from '../boards/Board';
import {isHazardTileType} from '../../common/TileType';

export class Irrigator extends BaseMilestone {
  constructor() {
    super(
      'Irrigator',
      'Own 4 tiles adjacent to oceans',
      4);
  }

  public getScore(player: Player): number {
    return player.game.board.spaces.filter((space) =>
      space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
    ).length;
  }
}
