import {CardResource} from '@/common/CardResource';
import {ColonyBenefit} from '@/common/colonies/ColonyBenefit';
import {ColonyName} from '@/common/colonies/ColonyName';
import {Resource} from '@/common/Resource';
import {Colony} from '@/server/colonies/Colony';

export class Kuiper extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.KUIPER,
      build: {
        description: 'Add 2 asteroids to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [2, 2, 2],
      },
      trade: {
        description: 'Add N asteroids to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [0, 1, 1, 2, 2, 3, 3],
      },
      colony: {
        description: 'Gain 3 M€',
        type: ColonyBenefit.GAIN_RESOURCES,
        resource: Resource.MEGACREDITS,
        quantity: 3,
      },
      cardResource: CardResource.ASTEROID,
    });
  }
}
