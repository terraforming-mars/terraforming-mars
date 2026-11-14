import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardType} from '../../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Tycoon10 extends BaseMilestone {
  public readonly automaDescription = '10+ blue/green cards in played pile';
  constructor() {
    super(
      'Tycoon10',
      'Have 10 blue and green cards in play.',
      10);
  }
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED).length;
  }

  /** MarsBot needs 10 blue and green cards in its own played pile (rulebook C p.14). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.playedProjectCards.filter((card) => card.type !== CardType.EVENT).length >= 10;
  }
}
