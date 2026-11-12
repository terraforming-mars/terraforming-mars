import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Board, isSpecialTile} from '../../boards/Board';
import {TileType} from '../../../common/TileType';

export class Founder implements IAward {
  public readonly name = 'Founder';
  public readonly description = 'Have the most tiles adjacent to special tiles.';
  public readonly automaDescription = 'Tiles next to special tiles (Neural Instance counts for MarsBot)';

  public getScore(player: IPlayer): number {
    const board = player.game.board;
    const specialTiles = board.spaces.filter((space) => {
      const tileType = space.tile?.tileType;
      // The Neural Instance tile is MarsBot's, so only MarsBot counts it as special (rulebook C p.9 and p.15).
      if (tileType === TileType.NEURAL_INSTANCE) {
        return player === player.game.marsBotPlayer;
      }
      return isSpecialTile(tileType);
    });
    const adjacentToSpecialSpaces = new Set(specialTiles.map((s) => board.getAdjacentSpaces(s)).flat());

    const count = board.spaces.filter(Board.ownedBy(player))
      .filter((space) => space.tile !== undefined)
      .filter((space) => adjacentToSpecialSpaces.has(space))
      .length;
    return count;
  }
}
