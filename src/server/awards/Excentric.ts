import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {IMarsBot} from '../automa/MarsBotCorpTypes';

export class Excentric implements IAward {
  public readonly name = 'Excentric';
  public readonly description = 'Have the most resources on cards in play';
  public getScore(player: IPlayer): number {
    let score = 0;

    player.getCardsWithResources().forEach((card) => {
      score += card.resourceCount;
    });

    return score;
  }

  /** The automa rules count every 5 of MarsBot's M€ as one resource. */
  public marsBotScore(bot: IMarsBot): number {
    return Math.floor(bot.mcSupply / 5);
  }
}
