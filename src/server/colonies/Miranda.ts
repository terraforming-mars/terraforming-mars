import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {CardResource} from '../../common/CardResource';

export class Miranda extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.MIRANDA,
      description: {
        buildBonus: 'Add 1 animal to ANY card',
        tradeBonus: 'Add n animals to ANY card',
        colonyBonus: 'Draw 1 card',
      },

      cardResource: CardResource.ANIMAL,
      buildType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeQuantity: [0, 1, 1, 2, 2, 3, 3],
      colonyBonusType: ColonyBenefit.DRAW_CARDS,
    });
  }
}
