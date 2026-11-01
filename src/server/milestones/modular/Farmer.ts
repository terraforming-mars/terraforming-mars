import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {CardResource} from '../../../common/CardResource';
import {BoardName} from '../../../common/boards/BoardName';

export class Farmer extends BaseMilestone {
  public readonly automaDescription = 'Bio track ≥ 7';
  public readonly automaMapDescriptions = {
    [BoardName.VASTITAS_BOREALIS_NOVA]: 'Science/Microbe track or Bio track ≥ 6',
  };
  constructor() {
    super(
      'Farmer',
      'Have 5 animal and microbe resources on your cards',
      5);
  }
  public getScore(player: IPlayer): number {
    return player.getResourceCount(CardResource.MICROBE) + player.getResourceCount(CardResource.ANIMAL);
  }
}
