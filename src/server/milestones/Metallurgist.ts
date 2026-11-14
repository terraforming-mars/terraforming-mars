import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '@/common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Metallurgist extends BaseMilestone {
  public readonly automaDescription = 'Building + Space tracks ≥ 9';
  constructor() {
    super(
      'Metallurgist',
      'Have a total of 6 steel and titanium production',
      6);
  }

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }

  /** MarsBot needs its Building and Space tracks to add up to 9 (rulebook C p.13). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.trackPosition(Tag.BUILDING) + marsBot.marsBotBoard.trackPosition(Tag.SPACE) >= 9;
  }
}
