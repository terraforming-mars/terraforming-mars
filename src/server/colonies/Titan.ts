import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';
import {CardResource} from '../../common/CardResource';

export class Titan extends Colony {
  public override isActive = false;
  constructor() {
    super({
      description: {
        buildBonus: 'Add 3 floaters to ANY card',
        tradeBonus: 'Add n floaters to ANY card',
        colonyBonus: 'Add 1 floater to ANY card',
      },

      name: ColonyName.TITAN,
      cardResource: CardResource.FLOATER,
      buildType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      buildQuantity: [3, 3, 3],
      tradeType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
      tradeQuantity: [0, 1, 1, 2, 3, 3, 4],
      colonyBonusType: ColonyBenefit.ADD_RESOURCES_TO_CARD,
    });
  }
}
