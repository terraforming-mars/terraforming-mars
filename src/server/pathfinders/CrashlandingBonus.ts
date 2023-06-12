import {IGame} from '../IGame';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {Board} from '../boards/Board';
import {ISpace} from '../boards/ISpace';

// Reward portion of Crashlanding. It's split out to prevent recursive source loading.
export class CrashlandingBonus {
  public static onTilePlacedAdjacentToCrashlanding(game: IGame, crashlandingSpace: ISpace, newTileSpace: ISpace): Array<SpaceBonus> {
    const position = this.getAdjacentPosition(game.board, crashlandingSpace, newTileSpace);
    if (position === -1) return [];
    const mod = crashlandingSpace.tile?.rotated ? 1 : 0;
    return [SpaceBonus.DATA, (position % 2 === mod) ? SpaceBonus.STEEL : SpaceBonus.TITANIUM];
  }

  /*
   * Find where b is in relation to a.
   *
   *    1 2
   *   0 a 3
   *    5 4
   *
   * If b is not next to a, return -1.
   */
  static getAdjacentPosition(board: Board, a: ISpace, b: ISpace): number {
    const spaces = board.getAdjacentSpacesClockwise(a);
    return spaces.findIndex((space) => space?.id === b.id);
  }
}
