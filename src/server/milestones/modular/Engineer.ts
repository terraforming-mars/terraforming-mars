import {BaseMilestone} from '../IMilestone';
import {IPlayer} from '../../IPlayer';
import {BoardName} from '../../../common/boards/BoardName';

export class Engineer extends BaseMilestone {
  public readonly automaDescription = 'Energy + Earth tracks ≥ 10';
  public readonly automaMapDescriptions = {
    [BoardName.VASTITAS_BOREALIS_NOVA]: 'Earth/Jovian + Energy/City tracks ≥ 10',
  };
  constructor() {
    super(
      'Engineer',
      'Have a total of 10 energy and heat production',
      10);
  }

  public getScore(player: IPlayer): number {
    return player.production.energy + player.production.heat;
  }
}
