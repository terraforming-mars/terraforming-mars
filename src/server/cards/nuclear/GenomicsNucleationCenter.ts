import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class GenomicsNucleationCenter extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.GENOMICS_NUCLEATION_CENTER,
      tags: [Tag.MICROBE],
      cost: 6,
      resourceType: CardResource.MICROBE,

      action: {
        or: {
          autoSelect: true,
          behaviors: [{
            title: 'Remove 3 microbes to draw a Card and gain 2M€',
            spend: {resourcesHere: 3},
            drawCard: 1,
            stock: {megacredits: 2},
          },
          {
            title: 'Add 1 microbe to this card',
            addResources: 1,
          }],
        },
      },

      metadata: {
        cardNumber: 'N77',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 microbe to this card.', (eb) => {
            eb.empty().startAction.microbes(1);
          }).br;
          b.or().br;
          b.action('Remove 3 microbes from this card to draw a Card and gain 2M€.', (eb) => {
            eb.microbes(3).startAction.cards(1).megacredits(2);
          }).br;
        }),
      },
    });
  }
}
