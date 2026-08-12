import {IProjectCard} from '../IProjectCard';
import {IActionCard} from '../ICard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {Tag} from '../../../common/cards/Tag';

export class FloatingRefinery extends ActionCard implements IProjectCard, IActionCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.FLOATING_REFINERY,
      cost: 7,
      tags: [Tag.VENUS],
      resourceType: CardResource.FLOATER,

      behavior: {
        addResources: {tag: Tag.VENUS},
      },

      action: {
        or: {
          autoSelect: true,
          behaviors: [
            {
              title: 'Remove 2 floaters from ANY CARD to gain 1 titanium and 2 M€',
              removeResourcesFromAnyCard: {type: CardResource.FLOATER, count: 2},
              stock: {titanium: 1, megacredits: 2},
            },
            {
              title: 'Add 1 floater to this card',
              addResources: 1,
            },
          ],
        },
      },

      metadata: {
        cardNumber: 'P73',
        renderData: CardRenderer.builder((b) => {
          b.arrow().resource(CardResource.FLOATER).nbsp.or().br;
          b.resource(CardResource.FLOATER, 2).asterix().arrow().titanium(1).megacredits(2).br;

          b.plainText('Action: Add 1 floater here, or remove 2 floaters from ANY CARD to gain 1 titanium and 2 M€.', /* parens */ true);
          b.br;
          b.resource(CardResource.FLOATER, 1).slash().tag(Tag.VENUS);
        }),
        description: 'Add 1 floater here for each Venus tag you have.',
      },
    });
  }
}
