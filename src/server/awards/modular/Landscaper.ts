import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';
import {Board} from '../../boards/Board';
import {MoonExpansion} from '../../moon/MoonExpansion';

export class Landscaper implements IAward {
  public readonly name = 'Landscaper';
  public readonly description = 'Most tiles connected together (each player counts largest group of tiles)';
  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const marsCount = new SpaceCounter(board, this.getSpaces(board, player)).compute();

    let moonCount = 0;
    MoonExpansion.ifMoon(player.game, (moonData) => {
      const moon = moonData.moon;
      moonCount = new SpaceCounter(moon, this.getSpaces(moon, player)).compute();
    });
    return Math.max(marsCount, moonCount);
  }

  private getSpaces(board: Board, player: IPlayer) {
    return board.spaces.filter((space) =>
      space.player === player && space.tile !== undefined);
  }
}

class SpaceCounter {
  private board: Board;
  private spaces: Set<Space>;
  private largestGroupSize: number;

  constructor(board: Board, spaces: Array<Space>) {
    this.board = board;
    this.spaces = new Set(spaces);
    this.largestGroupSize = 0;
  }

  public compute(): number {
    while (this.spaces.size > 0) {
      const space = this.spaces.values().next().value;
      if (space === undefined) {
        break;
      }
      // this.spaces.delete(space);
      const groupSize = this.dfs(space);
      this.largestGroupSize = Math.max(this.largestGroupSize, groupSize);
    }

    return this.largestGroupSize;
  }


  /**
   * Count the size of the connected region attached to `space` from the
   * supplied set of spaces.
   *
   * While counting, it updates `this.spaces`, thereby tracking all the spaces
   * already been seen, so as to not count the same space twice.
   */
  private dfs(space: Space): number {
    const stack = [space];
    let groupSize = 0;

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || !this.spaces.has(current)) {
        continue;
      }
      this.spaces.delete(current);
      groupSize++;

      // Get adjacent spaces owned by the same player
      const adjacentSpaces = this.board.getAdjacentSpaces(current);
      for (const adj of adjacentSpaces) {
        if (this.spaces.has(adj)) {
          stack.push(adj);
        }
      }
    }

    return groupSize;
  }
}
