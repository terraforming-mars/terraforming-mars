import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {hazardSeverity} from '../../../common/AresTileType';

// Is this exactly the same as Edgedancer?
export class Suburbian implements IAward {
  public readonly name = 'Suburbian';
  public readonly description = 'Most tiles on areas along the edges of the map';
  public getScore(player: IPlayer): number {
    return player.game.board.getEdges().filter((space) => {
      if (space.tile === undefined || hazardSeverity(space.tile.tileType) !== 'none') {
        return false;
      }
      return space.player === player;
    }).length;
  }
}
