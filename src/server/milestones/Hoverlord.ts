import {BaseMilestone} from './IMilestone';
import {Player} from '../Player';
import {CardResource} from '../../common/CardResource';

export class Hoverlord extends BaseMilestone {
  constructor() {
    super(
      'Hoverlord',
      'Have 7 floater resources on your cards',
      7);
  }
  public getScore(player: Player): number {
    let floaterResources = 0;
    player.getCardsWithResources(CardResource.FLOATER).forEach((card) => {
      floaterResources += card.resourceCount;
    });
    return floaterResources;
  }
}
