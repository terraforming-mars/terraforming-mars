import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Smith extends BaseMilestone {
  public readonly automaDescription = 'Building + Space tracks ≥ 7';
  constructor() {
    super(
      'Smith',
      'Have a total of 6 steel and titanium production',
      6);
  }

  public getScore(player: IPlayer): number {
    return player.production.steel + player.production.titanium;
  }

  /**
   * MarsBot needs its Building and Space tracks to add up to 7 (rulebook C p.10, which calls it
   * Metallurgist).
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.marsBotBoard.trackPosition(Tag.BUILDING) + marsBot.marsBotBoard.trackPosition(Tag.SPACE) >= 7;
  }
}
