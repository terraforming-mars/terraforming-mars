import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardResource} from '../../../common/CardResource';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Livestock extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.LIVESTOCK,
      tags: [Tag.ANIMAL],
      cost: 13,

      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: {oxygen: 9},

      behavior: {
        production: {plants: -1, megacredits: 2},
      },

      action: {
        addResources: 1,
      },

      metadata: {
        cardNumber: '184',
        renderData: CardRenderer.builder((b) => {
          b.action('Add 1 animal to this card.', (eb) => {
            eb.empty().startAction.resource(CardResource.ANIMAL);
          }).br;
          b.production((pb) => {
            pb.minus().plants(1).nbsp.plus().megacredits(2);
          }).br;
          b.vpText('1 VP for each animal on this card.');
        }),
        description: {
          text: 'Requires 9% oxygen. Decrease your plant production 1 step and increase your M€ production 2 steps',
          align: 'left',
        },
      },
    });
  }
}

