import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {Board} from '../boards/Board';
import {HAZARD_TILES} from '../../common/TileType';
import {AwardName} from '../../common/ma/AwardName';

export class Rugged implements IAward {
  public name: AwardName = 'Rugged';
  public description: string = 'Have the most tiles adjacent to hazards';

  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const score = board.spaces
      .filter(Board.ownedBy(player))
      .filter(Board.hasRealTile)
      .filter((space) => board.getAdjacentSpaces(space).some((s) => s.tile && HAZARD_TILES.has(s.tile.tileType)))
      .length;

    return score;
  }
}
