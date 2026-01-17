import {IAward} from '@/server/awards/IAward';
import {IPlayer} from '@/server/IPlayer';

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
}
