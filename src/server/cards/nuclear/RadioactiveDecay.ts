import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {ActionCard} from '../ActionCard';

export class RadioactiveDecay extends ActionCard {
  constructor() {
    super({
      name: CardName.RADIOACTIVE_DECAY,
      type: CardType.ACTIVE,
      tags: [Tag.SCIENCE, Tag.EARTH],
      cost: 15,
      resourceType: CardResource.RADIATION,
      victoryPoints: {resourcesHere:{}, per: 2},

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              addResources: 1,
              title: 'Add 1 radiation to this card.',
            },
            {
              spend: {resourcesHere: 1},
              stock: {steel: 1, heat: 1},
              title: 'Remove 1 radiation here to gain 1 steel and 1 heat.',
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'N52',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 radiation to this card.', (be) => {
            be.empty().startAction.radiations(1).asterix();
          }).br;
          b.or(Size.SMALL).br;
          b.action('Remove 1 radiation here to gain 1 steel and 1 heat.', (be) => {
            be.radiations(1).startAction.steel(1).heat(1);
          });
        }),
      },
    });
  }
}
