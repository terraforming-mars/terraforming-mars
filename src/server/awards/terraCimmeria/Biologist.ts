import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Biologist implements IAward {
  public readonly name = 'Biologist';
  public readonly description = 'Have the most animal, plant, and microbe tags in play';
  public readonly automaDescription = 'Bio track + 5';

  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.MICROBE, Tag.PLANT, Tag.ANIMAL], 'award');
  }

  /** Scores MarsBot's Bio track space plus 5 (rulebook C p.14). */
  public marsBotScore(marsBot: IMarsBot): number {
    return marsBot.marsBotBoard.trackPosition(Tag.PLANT) + 5;
  }
}
