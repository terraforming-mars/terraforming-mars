import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';

export class Constructor implements IAward {
  public readonly name = 'Constructor';
  public readonly description = 'Have the most Colonies and Cities combined';

  public getScore(player: IPlayer): number {
    return player.getColoniesCount() + player.game.board.getCities(player).length;
  }
}
