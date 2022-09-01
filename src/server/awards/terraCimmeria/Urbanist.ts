import {Board} from '../../boards/Board';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {IAward} from '../IAward';

export class Urbanist implements IAward {
  public readonly name = 'Urbanist';
  public readonly description = 'Most VP from city tile adjacencies on Mars';

  public getScore(player: Player): number {
    let score = 0;

    player.game.board.spaces.forEach((space) => {
      // Victory points for greenery tiles adjacent to cities
      if (Board.isCitySpace(space) && space.player !== undefined && space.player.id === player.id) {
        const adjacent = player.game.board.getAdjacentSpaces(space);
        for (const adj of adjacent) {
          if (adj.tile && adj.tile.tileType === TileType.GREENERY) score++;
        }
      }
    });

    return score;
  }
}
