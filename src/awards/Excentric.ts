import {IAward} from './IAward';
import {Player} from '../Player';

export class Excentric implements IAward {
  public name: string = 'Excentric';
  public description: string = 'Most resources on cards';
  public getScore(player: Player): number {
    let score: number = 0;

    player.getCardsWithResources().forEach((card) => {
      score += card.resourceCount;
    });

    return score;
  }
}
