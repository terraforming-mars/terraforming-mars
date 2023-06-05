import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../requirements/CardRequirements';
import {all} from '../Options';
import {Tag} from '../../../common/cards/Tag';

export class WaterTreatmentComplex extends Card {
  constructor() {
    super({
      name: CardName.WATER_TREATMENT_COMPLEX,
      type: CardType.AUTOMATED,
      tags: [Tag.MOON],
      cost: 12,
      requirements: CardRequirements.builder((b) => b.habitatTiles(1, {all})),
      reserveUnits: {titanium: 1},

      behavior: {
        moon: {habitatRate: 2},
      },

      metadata: {
        description: 'Requires 1 habitat tile on The Moon. Spend 1 titanium. Raise the habitat rate 2 steps.',
        cardNumber: 'M46',
        renderData: CardRenderer.builder((b) => b.minus().titanium(1).br.moonHabitatRate({amount: 2})),
      },
    });
  }
}
