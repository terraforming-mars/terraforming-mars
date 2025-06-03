import {Colony} from './Colony';
import {ColonyName} from '../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../common/colonies/ColonyBenefit';

export class Pluto extends Colony {
  constructor() {
    super({
      name: ColonyName.PLUTO,
      description: {
        buildBonus: 'Draw 2 cards',
        tradeBonus: 'Draw n cards',
        colonyBonus: 'Draw 1 card and then discard 1 card',
      },

      buildType: ColonyBenefit.DRAW_CARDS,
      buildQuantity: [2, 2, 2],
      tradeType: ColonyBenefit.DRAW_CARDS,
      tradeQuantity: [0, 1, 2, 2, 3, 3, 4],
      colonyBonusType: ColonyBenefit.DRAW_CARDS_AND_DISCARD_ONE,
    });
  }
}
