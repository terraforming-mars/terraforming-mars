import {BaseMilestone} from './IMilestone';
import {IPlayer} from '../IPlayer';
import {CardResource} from '../../common/CardResource';

export class Hoverlord extends BaseMilestone {
  constructor() {
    super(
      'Hoverlord',
      'Have 7 floater resources on your cards',
      7);
  }
  public getScore(player: IPlayer): number {
    let floaterResources = 0;
    player.getCardsWithResources(CardResource.FLOATER).forEach((card) => {
      floaterResources += card.resourceCount;
    });
    return floaterResources;
  }
}
