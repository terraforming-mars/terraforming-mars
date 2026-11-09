import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Tycoon extends BaseMilestone {
  public readonly automaDescription = '15+ blue/green cards in played pile';
  constructor() {
    super(
      'Tycoon',
      'Have 15 project cards in play (not events.)',
      15);
  }
  public getScore(player: IPlayer): number {
    return player.playedCards
      .filter((card) => card.type === CardType.ACTIVE || card.type === CardType.AUTOMATED).length;
  }

  /** MarsBot needs 15 blue and green cards in its own played pile (rulebook C p.9). */
  public marsBotCanClaim(marsBot: IMarsBot): boolean {
    return marsBot.playedProjectCards.filter((card) => card.type !== CardType.EVENT).length >= 15;
  }
}
