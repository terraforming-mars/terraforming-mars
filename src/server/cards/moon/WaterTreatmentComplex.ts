import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';
import {all} from '../Options';

export class WaterTreatmentComplex extends Card {
  constructor() {
    super({
      name: CardName.WATER_TREATMENT_COMPLEX,
      cardType: CardType.AUTOMATED,
      cost: 12,
      requirements: CardRequirements.builder((b) => b.colonyTiles(1, {all})),
      reserveUnits: {titanium: 1},

      behavior: {
        moon: {colonyRate: 2},
      },

      metadata: {
        description: 'Requires 1 colony tile on The Moon. Spend 1 titanium. Raise the Colony Rate 2 steps.',
        cardNumber: 'M46',
        renderData: CardRenderer.builder((b) => b.minus().titanium(1).br.moonColonyRate({amount: 2})),
      },
    });
  }
}
