import {IAward} from '../IAward';
import {IPlayer} from '../../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Botanist implements IAward {
  public readonly name = 'Botanist';
  public readonly description = 'Have the most plant production';
  public readonly automaDescription = 'Bio track - 2';
  public getScore(player: IPlayer): number {
    return player.production.plants;
  }

  /** Scores MarsBot's Bio track space minus 2, which can be below 0 (rulebook C p.10 and p.14). */
  public marsBotScore(marsBot: IMarsBot): number {
    return marsBot.marsBotBoard.trackPosition(Tag.PLANT) - 2;
  }
}
