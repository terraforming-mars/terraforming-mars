import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';
import {ActionCard} from '../ActionCard';

export class ExtremeColdFungus extends ActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EXTREME_COLD_FUNGUS,
      tags: [Tag.MICROBE],
      cost: 13,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              addResourcesToAnyCard: {
                type: CardResource.MICROBE,
                count: 2,
              },
              title: 'Select card to add 2 microbes',
            },
            {
              stock: {plants: 1},
              title: 'Gain 1 plant',
            },
          ],
        },
      },

      requirements: CardRequirements.builder((b) => b.temperature(-10, {max})),
      metadata: {
        cardNumber: '134',
        description: 'It must be -10 C or colder.',
        renderData: CardRenderer.builder((b) => {
          b.action('Gain 1 plant.', (eb) => {
            eb.empty().startAction.plants(1);
          }).br;
          b.or().br;
          b.action('Add 2 microbes to ANOTHER card.', (eb) => {
            eb.empty().startAction.microbes(2).asterix();
          });
        }),
      },
    });
  }
}
