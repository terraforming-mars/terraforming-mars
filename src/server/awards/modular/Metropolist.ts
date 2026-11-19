import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Metropolist implements IAward {
  public readonly name = 'Metropolist';
  public readonly description = 'Own the most cities';
  public readonly automaDescription = 'Cities owned (unchanged)';
  public getScore(player: IPlayer): number {
    return player.game.board.getCities(player).length;
  }
}
