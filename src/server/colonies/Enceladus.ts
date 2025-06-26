import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {CardResource} from '../../common/CardResource';

export class Enceladus extends Colony {
  public override isActive = false;
  constructor() {
    super({
      name: ColonyName.ENCELADUS,
      description: {
        buildBonus: 'Add 3 microbes to ANY card',
        tradeBonus: 'Add n microbes to ANY card',
        colonyBonus: 'Add 1 microbe to ANY card',
      },

      cardResource: CardResource.MICROBE,
      buildType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      buildQuantity: [3, 3, 3],
      tradeType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeQuantity: [0, 1, 2, 3, 4, 4, 5],
      colonyBonusType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
    });
  }
}
