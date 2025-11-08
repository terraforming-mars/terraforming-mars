import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {CardResource} from '../../common/CardResource';

export class Enceladus extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.ENCELADUS,
      cardResource: CardResource.MICROBE,
      build: {
        description: 'Add 3 microbes to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [3, 3, 3],
      },
      trade: {
        description: 'Add n microbes to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [0, 1, 2, 3, 4, 4, 5],
      },
      colony: {
        description: 'Add 1 microbe to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      },
    });
  }
}
