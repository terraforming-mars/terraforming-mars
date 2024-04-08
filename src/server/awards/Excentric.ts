import {IAward} from './IAward';
import {IPlayer} from '../IPlayer';
import {CardName} from '../../common/cards/CardName';

export class Excentric implements IAward {
  public readonly name = 'Excentric';
  public readonly description = 'Have the most resources on cards in play';
  public getScore(player: IPlayer): number {
    let score = 0;

    player.getCardsWithResources().forEach((card) => {
      // Self-Replicating Robots resources do not count towards excentric
      if (card.name !== CardName.SELF_REPLICATING_ROBOTS) score += card.resourceCount;
    });

    return score;
  }
}
