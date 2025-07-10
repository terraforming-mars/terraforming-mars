import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {CardResource} from '../../common/CardResource';

export class Titan extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.TITAN,
      cardResource: CardResource.FLOATER,
      build: {
        description: 'Add 3 floaters to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [3, 3, 3],
      },
      trade: {
        description: 'Add n floaters to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [0, 1, 1, 2, 3, 3, 4],
      },
      colony: {
        description: 'Add 1 floater to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      },
    });
  }
}
