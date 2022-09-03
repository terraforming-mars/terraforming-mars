import {Player} from '../../Player';
import {CardResource} from '../../../common/CardResource';
import {IAward} from '../IAward';

export class Zoologist2 implements IAward {
  public readonly name = 'A. Zoologist';
  public readonly description = 'Most animal and microbe resources';

  public getScore(player: Player): number {
    const resourceTypes = [CardResource.ANIMAL, CardResource.MICROBE];
    let score = 0;

    player.getCardsWithResources().filter((card) => card.resourceType !== undefined && resourceTypes.includes(card.resourceType)).forEach((card) => {
      score += card.resourceCount;
    });

    return score;
  }
}
