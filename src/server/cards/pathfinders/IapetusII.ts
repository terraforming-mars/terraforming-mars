import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';
import {CardResource} from '../../../common/CardResource';

export class IapetusII extends Colony {
  constructor() {
    super({
      name: ColonyName.IAPETUS_II,
      description: {
        buildBonus: 'Add 3 data to ANY card',
        tradeBonus: 'Add n data to ANY card',
        colonyBonus: 'Add 1 data to ANY card',
      },

      cardResource: CardResource.DATA,
      buildType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      buildQuantity: [3, 3, 3],

      tradeType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeQuantity: [0, 1, 2, 3, 4, 5, 6],
      colonyBonusType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
    });
  }
  public override isActive = false;
}
