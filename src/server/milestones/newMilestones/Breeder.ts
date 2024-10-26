import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';

export class Breeder extends BaseMilestone {
  constructor() {
    super(
      'Breeder',
      'Have 5 Animal and Microbe resources on your cards',
      5);
  }
  public getScore(player: IPlayer): number {
    let microbeResources = 0;
    let animalResources = 0;
    player.getCardsWithResources(CardResource.MICROBE).forEach((card) => {
      microbeResources += card.resourceCount;
    });
    player.getCardsWithResources(CardResource.ANIMAL).forEach((card) => {
      animalResources += card.resourceCount;
    });
    return microbeResources + animalResources;
  }
}
