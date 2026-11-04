import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '@/server/automa/IMarsBot';

export class Excentric implements IAward {
  public readonly name = 'Excentric';
  public readonly description = 'Have the most resources on cards in play';
  public readonly automaDescription = 'Every 5 M€ = 1 resource';
  public getScore(player: IPlayer): number {
    let score = 0;

    player.getCardsWithResources().forEach((card) => {
      score += card.resourceCount;
    });

    return score;
  }

  /** Counts every 5 of MarsBot's M€ as one resource (rulebook C p.9 and p.14). */
  public marsBotScore(bot: IMarsBot): number {
    return Math.floor(bot.megacredits / 5);
  }
}
