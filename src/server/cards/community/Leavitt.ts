import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Leavitt extends Colony {
  constructor() {
    super({
      name: ColonyName.LEAVITT,
      build: {
        description: 'Gain 1 science tag',
        type: ColonyBenefit.GAIN_SCIENCE_TAG,
      },
      trade: {
        description: 'Draw n cards, keep 1',
        type: ColonyBenefit.DRAW_CARDS_AND_KEEP_ONE,
        quantity: [1, 2, 3, 4, 5, 6, 7],
      },
      colony: {
        description: 'Draw 1 card which you may pay to keep',
        type: ColonyBenefit.DRAW_CARDS_AND_BUY_ONE,
      },
    });
  }
}
