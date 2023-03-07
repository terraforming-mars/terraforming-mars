import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class WaterSplittingPlant extends ActionCard implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.WATER_SPLITTING_PLANT,
      tags: [Tag.BUILDING],
      cost: 12,

      action: {
        spend: {energy: 3},
        global: {oxygen: 1},
      },

      requirements: CardRequirements.builder((b) => b.oceans(2)),
      metadata: {
        cardNumber: '177',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 3 energy to raise oxygen 1 step.', (eb) => {
            eb.energy(3).startAction.oxygen(1);
          });
        }),
        description: 'Requires 2 ocean tiles.',
      },
    });
  }
}
