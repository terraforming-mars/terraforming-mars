import {Player} from '../../Player';
import {CardResource} from '../../common/CardResource';
import {IAward} from '../IAward';

export class Zoologist2 implements IAward {
  public name: string = 'A. Zoologist';
  public description: string = 'Most animal and microbe resources';

  public getScore(player: Player): number {
    const resourceTypes = [CardResource.ANIMAL, CardResource.MICROBE];
    let score: number = 0;

    player.getCardsWithResources().filter((card) => card.resourceType !== undefined && resourceTypes.includes(card.resourceType)).forEach((card) => {
      score += card.resourceCount;
    });

    return score;
  }
}
