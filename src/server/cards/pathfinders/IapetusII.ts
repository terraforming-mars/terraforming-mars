import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {CardResource} from '../../../common/CardResource';

export class IapetusII extends Colony {
  constructor() {
    super({
      name: ColonyName.IAPETUS_II,
      cardResource: CardResource.DATA,
      build: {
        description: 'Add 3 data to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [3, 3, 3],
      },
      trade: {
        description: 'Add n data to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [0, 1, 2, 3, 4, 5, 6],
      },
      colony: {
        description: 'Add 1 data to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      },
    });
  }
  public override isActive = false;
}
