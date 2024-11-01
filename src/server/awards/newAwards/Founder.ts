import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {isSpecialTileSpace} from '../../boards/Board';
import {Space} from '../../boards/Space';

export class Founder implements IAward {
  public readonly name = 'Founder';
  public readonly description = 'Have the most tiles adjacent to special tiles.';

  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const playerOwnedSpaces = board.spaces.filter((space) =>
      space.player === player && space.tile !== undefined);
    const specialTiles = board.spaces.filter((space) =>
      isSpecialTileSpace(space));
    const adjacentToSpecialSpaces = new Set<Space>();
    for (const specialSpace of specialTiles) {
      const adjacentSpaces = board.getAdjacentSpaces(specialSpace);
      for (const adjSpace of adjacentSpaces) {
        if (adjSpace) {
          adjacentToSpecialSpaces.add(adjSpace);
        }
      }
    }
    const countAdjacentToSpecial = playerOwnedSpaces.filter((space) =>
      adjacentToSpecialSpaces.has(space),
    ).length;
    return countAdjacentToSpecial;
  }
}
