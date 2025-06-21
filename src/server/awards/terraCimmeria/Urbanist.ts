import {Board} from '../../boards/Board';
import {IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {IAward} from '../IAward';
import {Space} from '../../boards/Space';

export class Urbanist implements IAward {
  public readonly name = 'Urbanist';
  public readonly description = 'Have the most VP from city tile adjacencies on Mars';

  public getScore(player: IPlayer): number {
    let score = 0;

    player.game.board.spaces.forEach((space) => {
      if (Board.isCitySpace(space) && space.player?.id === player.id) {
        // Victory points for greenery tiles adjacent to cities
        switch (space.tile?.tileType) {
        case TileType.CITY:
        case TileType.OCEAN_CITY:
        case TileType.NEW_HOLLAND:
          score += this.countGreeneries(player, space);
          break;
        case TileType.CAPITAL:
          score += this.countGreeneries(player, space) + this.getVictoryPoints(player, space);
          break;
        case TileType.RED_CITY:
          score += this.getVictoryPoints(player, space);
          break;
        default:
          throw new Error('foo');
        }
      }
    });

    return score;
  }

  private countGreeneries(player: IPlayer, space: Space) {
    let score = 0;
    const adjacent = player.game.board.getAdjacentSpaces(space);
    for (const adj of adjacent) {
      if (Board.isGreenerySpace(adj)) {
        score++;
      }
    }
    return score;
  }

  private getVictoryPoints(player: IPlayer, space: Space) {
    const cardName = space?.tile?.card;
    if (cardName === undefined) {
      return 0;
    }
    const card = player.getPlayedCard(cardName);
    if (card === undefined) {
      return 0;
    }
    return card.getVictoryPoints(player);
  }
}
