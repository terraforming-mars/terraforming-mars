import {Colony} from '../../colonies/Colony';
import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Iapetus extends Colony {
  constructor() {
    super({
      name: ColonyName.IAPETUS,
      build: {
        description: 'Gain 1 TR',
        type: ColonyBenefit.GAIN_TR,
      },
      trade: {
        description: 'Gain n TR',
        type: ColonyBenefit.GAIN_TR,
        quantity: [0, 0, 0, 1, 1, 1, 2],
      },
      colony: {
        description: 'Pay 1 M€ less for cards this generation',
        type: ColonyBenefit.GAIN_CARD_DISCOUNT,
      },
    });
  }
}
