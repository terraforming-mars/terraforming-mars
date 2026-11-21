import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardType} from '@/common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Legend extends BaseMilestone {
  public readonly automaDescription = '5+ red cards in played pile';
  constructor() {
    super(
      'Legend',
      'Have 5 cards in your event pile',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }

  /** MarsBot needs 5 events in its own played pile (rulebook C p.9). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.playedProjectCards.filter((card) => card.type === CardType.EVENT).length >= 5;
  }
}
