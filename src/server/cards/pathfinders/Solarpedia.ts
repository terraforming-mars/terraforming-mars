import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {CardResource} from '../../../common/CardResource';
import {ActionCard} from '../ActionCard';

export class Solarpedia extends ActionCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.SOLARPEDIA,
      type: CardType.ACTIVE,
      tags: [Tag.SPACE],
      cost: 12,
      requirements: [{tag: Tag.VENUS}, {tag: Tag.EARTH}, {tag: Tag.MARS}, {tag: Tag.JOVIAN}],
      resourceType: CardResource.DATA,
      victoryPoints: {resourcesHere: {}, per: 6},

      behavior: {
        addResourcesToAnyCard: {type: CardResource.DATA, count: 2},
      },

      action: {
        addResourcesToAnyCard: {type: CardResource.DATA, count: 2},
      },

      metadata: {
        cardNumber: 'Pf54',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 2 data to ANY card.', (ab) => {
            ab.empty().startAction.resource(CardResource.DATA, 2).asterix();
          }).br;
          b.resource(CardResource.DATA, 2).asterix();
        }),
        description: 'Requires 1 Venus, Earth, Mars, and Jovian Tag. Add 2 data to ANY card. 1 VP for every 6 data resources here.',
      },
    });
  }
}
