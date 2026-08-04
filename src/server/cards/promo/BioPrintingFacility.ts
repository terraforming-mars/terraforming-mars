import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {ActionCard} from '../ActionCard';

export class BioPrintingFacility extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.BIO_PRINTING_FACILITY,
      tags: [Tag.BUILDING],
      cost: 7,

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              spend: {energy: 2},
              addResourcesToAnyCard: {type: CardResource.ANIMAL, count: 1, mustHaveCard: true},
              title: 'Spend 2 energy to add 1 animal to another card',
            },
            {
              spend: {energy: 2},
              stock: {plants: 2},
              title: 'Spend 2 energy to gain 2 plants',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'X36',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 energy to gain 2 plants OR to add 1 animal to ANOTHER card.', (eb) => {
            eb.energy(2, {digit}).startAction.plants(2);
            eb.or().resource(CardResource.ANIMAL).asterix();
          });
        }),
      },
    });
  }
}
