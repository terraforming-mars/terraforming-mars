import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {hazardSeverity} from '../../../common/AresTileType';

// This could probably be computed with board.getAdjacentSpaces().length < 6.
const EDGE_IDS = new Set([
  '03', '04', '05', '06', '07',
  '08', '13',
  '14', '20',
  '21', '28',
  '29', '37',
  '38', '45',
  '46', '52',
  '53', '58',
  '59', '60', '61', '62', '63',
]);

export class Suburbian implements IAward {
  public readonly name = 'Suburbian';
  public readonly description = 'Most tiles on areas along the edges of the map.';
  public getScore(player: IPlayer): number {
    const board = player.game.board;
    return board.spaces.filter((space) => {
      if (!EDGE_IDS.has(space.id)) {
        return false;
      }
      if (space.tile === undefined || hazardSeverity(space.tile.tileType) !== 'none') {
        return false;
      }
      return space.player === player;
    }).length;
  }
}
