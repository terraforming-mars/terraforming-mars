import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardType} from '../../common/cards/CardType';
import {CardName} from '../../common/cards/CardName';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Forecaster implements IAward {
  public readonly name = 'Forecaster';
  public readonly description = 'Have the most cards with requirements in play';
  public readonly automaDescription = 'Every 7 M€ = 1 card with requirement';

  public getScore(player: IPlayer): number {
    const validCards = player.playedCards.filter((card) => card.requirements.length > 0);

    if (player.playedCards.has(CardName.ODYSSEY)) {
      return validCards.length;
    }
    return validCards.filter((card) => card.type !== CardType.EVENT).length;
  }

  /** Counts every 7 of MarsBot's M€ as one card with a requirement (rulebook C p.9 and p.14). */
  public marsBotScore(marsBot: IMarsBot): number {
    return Math.floor(marsBot.megacredits / 7);
  }
}
