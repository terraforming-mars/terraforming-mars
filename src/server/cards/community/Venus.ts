import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Venus extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.VENUS,
      build: {
        description: 'Increase Venus 1 step',
        type: ColonyBenefit.INCREASE_VENUS_SCALE,
      },
      trade: {
        description: 'Add n resources to ANY Venus card',
        type: ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD,
        quantity: [0, 0, 0, 1, 2, 3, 4],
      },
      colony: {
        description: 'Add 1 resource to ANY Venus card',
        type: ColonyBenefit.ADD_RESOURCES_TO_VENUS_CARD,
      },
      expansion: 'venus',
    });
  }
}
