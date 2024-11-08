import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Space} from '../../boards/Space';

export class Landscaper implements IAward {
  public readonly name = 'Landscaper';
  public readonly description = 'Most tiles connected together (each player counts largest group of tiles)';
  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const visited = new Set<Space>();
    let largestGroupSize = 0;

    const playerOwnedSpaces = board.spaces.filter((space) =>
      space.player === player && space.tile !== undefined);

    for (const space of playerOwnedSpaces) {
      if (!visited.has(space)) {
        const groupSize = this.dfs(space, player, visited);
        largestGroupSize = Math.max(largestGroupSize, groupSize);
      }
    }

    return largestGroupSize;
  }

  private dfs(space: Space, player: IPlayer, visited: Set<Space>): number {
    const stack = [space];
    let groupSize = 0;

    while (stack.length > 0) {
      const current = stack.pop();
      if (!current || visited.has(current)) {
        continue;
      }
      visited.add(current);
      groupSize++;

      // Get adjacent spaces owned by the same player
      const adjacentSpaces = player.game.board.getAdjacentSpaces(current);
      for (const adj of adjacentSpaces) {
        if (adj.player === player && !visited.has(adj)) {
          stack.push(adj);
        }
      }
    }

    return groupSize;
  }
}
