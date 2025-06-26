import {IProjectCard} from '../IProjectCard';
import {ActionCard} from '../ActionCard';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';

export class EconomicEspionage extends ActionCard implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.ECONOMIC_ESPIONAGE,
      cost: 8,
      tags: [Tag.EARTH],
      resourceType: CardResource.DATA,
      victoryPoints: {resourcesHere: {}, per: 3},

      action: {
        spend: {megacredits: 2},
        addResourcesToAnyCard: {count: 1, type: CardResource.DATA},
      },

      metadata: {
        cardNumber: 'Pf38',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 2 M€ to Add 1 data to ANY card.', (eb) => {
            eb.megacredits(2).startAction.resource(CardResource.DATA).asterix();
          }).br;
        }),
        description: '1VP for every 3 data here.',
      },
    });
  }
}
