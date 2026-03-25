import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {CardResource} from '../../common/CardResource';

export class Miranda extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.MIRANDA,
      cardResource: CardResource.ANIMAL,

      build: {
        description: 'Add 1 animal to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      },
      trade: {
        description: 'Add n animals to ANY card',
        type: ColonyBenefit.ADD_RESOURCES_TO_CARD,
        quantity: [0, 1, 1, 2, 2, 3, 3],
      },
      colony: {
        description: 'Draw 1 card',
        type: ColonyBenefit.DRAW_CARDS,
      },
    });
  }
}
