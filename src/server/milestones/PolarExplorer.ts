import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {isHazardTileType} from '../../common/TileType';
import {Board} from '../boards/Board';

export class PolarExplorer extends BaseMilestone {
  constructor() {
    super(
      'Polar Explorer',
      'Own 3 tiles on the two bottom rows',
      3);
  }
  public getScore(player: Player): number {
    return player.game.board.spaces
      .filter(Board.ownedBy(player))
      .filter((space) => space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        space.y >= 7 && space.y <= 8).length;
  }
}

