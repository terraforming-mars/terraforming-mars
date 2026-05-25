import {ColonyBenefit} from '@/common/colonies/ColonyBenefit';
import {ColonyName} from '@/common/colonies/ColonyName';
import {Colony} from '@/server/colonies/Colony';

export class Terra extends Colony {
  constructor() {
    super({
      name: ColonyName.TERRA,
      build: {
        description: 'Draw an Earth card',
        type: ColonyBenefit.DRAW_EARTH_CARD,
      },
      trade: {
        description: 'WGT raises indicated global parameter',
        type: ColonyBenefit.WGT_RAISE_GLOBAL_PARAMETER,
        quantity: [0, 0, 0, 1, 1, 2, 2],
      },
      colony: {
        description: 'Gain 1 M€ per 3 Earth tags in play',
        type: ColonyBenefit.GAIN_MC_FOR_EARTH_TAGS,
      },
      shouldIncreaseTrack: 'ask',
    });
  }
}
