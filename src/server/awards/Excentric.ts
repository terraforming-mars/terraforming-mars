import {IAward} from './IAward';
import {Player} from '../Player';

export class Excentric implements IAward {
  public readonly name = 'Excentric';
  public readonly description = 'Most resources on cards';
  public getScore(player: Player): number {
    let score = 0;

    player.getCardsWithResources().forEach((card) => {
      score += card.resourceCount;
    });

    return score;
  }
}
