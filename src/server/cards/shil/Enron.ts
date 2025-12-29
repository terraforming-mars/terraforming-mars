import {Colony} from '../../colonies/Colony';
// import {ColonyName} from '../../../common/colonies/ColonyName';
import {ColonyBenefit} from '../../../common/colonies/ColonyBenefit';

export class Enron extends Colony {
  constructor() {
    super({
      // @ts-ignore
      name: 'Enron', // ColonyName.ENRON,
      build: {
        description: 'Gain 2 corruption',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [2, 2, 2],
      },
      trade: {
        description: 'Gain n corruption',
        type: ColonyBenefit.GAIN_RESOURCES,
        quantity: [0, 0, 0, 1, 2, 3, 4],
      },
      colony: {
        description: 'Draw 1 card',
        type: ColonyBenefit.DRAW_CARDS,
        quantity: 1,
      },
    });
  }
}
