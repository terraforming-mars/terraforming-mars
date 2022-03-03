import {IMilestone} from './IMilestone';
import {Player} from '../Player';
import {Board} from '../boards/Board';
import {isHazardTileType} from '../common/TileType';

export class Irrigator implements IMilestone {
  public name: string = 'Irrigator';
  public description: string = 'Have at least 4 tiles adjacent to oceans';

  public getScore(player: Player): number {
    return player.game.board.spaces.filter((space) =>
      space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        player.game.board.getAdjacentSpaces(space).some((space) => Board.isOceanSpace(space)),
    ).length;
  }

  public canClaim(player: Player): boolean {
    return this.getScore(player) >= 4;
  }
}
