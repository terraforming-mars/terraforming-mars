import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Board, isSpecialTileSpace} from '../../boards/Board';

export class Founder implements IAward {
  public readonly name = 'Founder';
  public readonly description = 'Have the most tiles adjacent to special tiles.';

  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const specialTiles = board.spaces.filter(isSpecialTileSpace);
    const adjacentToSpecialSpaces = new Set(specialTiles.map((s) => board.getAdjacentSpaces(s)).flat());

    const count = board.spaces.filter(Board.ownedBy(player))
      .filter((space) => space.tile !== undefined)
      .filter((space) => adjacentToSpecialSpaces.has(space))
      .length;
    return count;
  }
}
