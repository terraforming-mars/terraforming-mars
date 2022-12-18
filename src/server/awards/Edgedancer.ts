import {IAward, getAdditionalScore} from './IAward';
import {Player} from '../Player';
import {isHazardTileType} from '../../common/TileType';

export class Edgedancer implements IAward {
  public readonly name = 'Edgedancer';
  public readonly description = 'Most tiles on the edges of the board';

  public getScore(player: Player): number {
    const score = player.game.board.spaces
      .filter((space) => space.player !== undefined &&
        space.player === player &&
        space.tile !== undefined &&
        isHazardTileType(space.tile.tileType) === false &&
        this.isOnEdge(space.x, space.y)).length;
    return score + getAdditionalScore(player);
  }

  private isOnEdge(x: number, y: number): boolean {
    if (y === 0) return true;
    if (y === 8) return true;
    if (x === 8) return true;
    if (x === (Math.abs(4-y))) return true;
    return false;
  }
}
