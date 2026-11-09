import {IPlayer} from '../../IPlayer';
import {IAward} from '../IAward';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';
export class Manufacturer implements IAward {
  public readonly name = 'Manufacturer';
  public readonly description = 'Have the highest production of steel and heat combined.';
  public readonly automaDescription = 'Building + Energy track';

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.heat;
  }

  /** Scores MarsBot's Building and Energy track spaces combined (rulebook C p.15). */
  public marsBotScore(marsBot: IMarsBot): number {
    return marsBot.marsBotBoard.trackPosition(Tag.BUILDING) + marsBot.marsBotBoard.trackPosition(Tag.POWER);
  }
}
