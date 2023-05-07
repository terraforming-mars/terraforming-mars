import {Board} from '../../boards/Board';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {IAward} from '../IAward';

export class Urbanist implements IAward {
  public readonly name = 'Urbanist';
  public readonly description = 'Have the most VP from city tile adjacencies on Mars';

  public getScore(player: Player): number {
    let score = 0;

    player.game.board.spaces.forEach((space) => {
      if (Board.isCitySpace(space) && space.player?.id === player.id) {
        // Victory points for greenery tiles adjacent to cities
        switch (space.tile?.tileType) {
        case TileType.CITY:
        case TileType.OCEAN_CITY:
          const adjacent = player.game.board.getAdjacentSpaces(space);
          for (const adj of adjacent) {
            if (adj.tile?.tileType === TileType.GREENERY) score++;
          }
          break;
        case TileType.CAPITAL:
        case TileType.RED_CITY:
          const card = player.playedCards.find((c) => c.name === space?.tile?.card);
          if (card !== undefined) {
            score += card.getVictoryPoints(player);
          }
          break;
        default:
          throw new Error('foo');
        }
      }
    });

    return score;
  }
}
