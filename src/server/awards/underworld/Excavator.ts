import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';

export class Excavator implements IAward {
  public readonly name = 'Excavator';
  public readonly description = 'Have the most claimed underground resource tokens';
  public getScore(player: IPlayer): number {
    return player.underworldData.tokens.length;
  }
}
