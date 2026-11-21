import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '@/common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Legend4 extends BaseMilestone {
  public readonly automaDescription = '4+ red cards in played pile';
  constructor() {
    super(
      'Legend4',
      'Have 4 cards in your event pile',
      4);
  }
  public getScore(player: IPlayer): number {
    return player.getPlayedEventsCount();
  }

  /** MarsBot needs 4 events in its own played pile (rulebook C p.13). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.playedProjectCards.filter((card) => card.type === CardType.EVENT).length >= 4;
  }
}
