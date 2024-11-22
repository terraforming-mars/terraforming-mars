import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';

export class Breeder extends BaseMilestone {
  constructor() {
    super(
      'Breeder',
      'Have 5 animal and microbe resources on your cards',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.MICROBE) + player.getResourceCount(CardResource.ANIMAL);
  }
}
