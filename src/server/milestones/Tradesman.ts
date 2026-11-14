import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {Tag} from '../../common/cards/Tag';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Tradesman extends BaseMilestone {
  public readonly automaDescription = 'Energy, Earth and Venus tracks ≥ 2';
  constructor() {
    super(
      'Tradesman',
      'Have 3 different types of non-standard resources',
      3);
  }

  public getScore(player: IPlayer): number {
    const nonStandardResources = new Set(player.getCardsWithResources().map((card) => card.resourceType));
    if (player.underworldData.corruption > 0) {
      return nonStandardResources.size + 1;
    } else {
      return nonStandardResources.size;
    }
  }

  /**
   * MarsBot needs space 2 on its Energy, Earth and Venus tracks (rulebook C p.10, which calls it
   * Trader).
   */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return [Tag.POWER, Tag.EARTH, Tag.VENUS].every((tag) => marsBot.marsBotBoard.trackPosition(tag) >= 2);
  }
}
