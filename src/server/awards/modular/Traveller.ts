import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '../../../common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
import {BoardName} from '../../../common/boards/BoardName';

export class Traveller implements IAward {
  public readonly name = 'Traveller';
  public readonly description = 'Have the most Jovian and Earth tags in play combined';
  public readonly automaDescription = 'Higher of Earth or Jovian track + 5';
  public readonly automaMapDescriptions = {
    [BoardName.VASTITAS_BOREALIS_NOVA]: 'Earth/Jovian track + 5',
  };
  public getScore(player: IPlayer): number {
    return player.tags.multipleCount([Tag.JOVIAN, Tag.EARTH], 'award');
  }

  /** Rulebook C p.10 and p.15. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.max(bot.marsBotBoard.trackPosition(Tag.JOVIAN), bot.marsBotBoard.trackPosition(Tag.EARTH)) + 5;
  }
}
