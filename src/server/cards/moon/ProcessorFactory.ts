import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardResource} from '../../../common/CardResource';
import {CardRenderer} from '../render/CardRenderer';
import {ActionCard} from '../ActionCard';

export class ProcessorFactory extends ActionCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.PROCESSOR_FACTORY,
      type: CardType.ACTIVE,
      tags: [Tag.MOON, Tag.BUILDING],
      cost: 8,

      action: {
        spend: {steel: 1},
        addResourcesToAnyCard: {type: CardResource.DATA, count: 2},
      },

      resourceType: CardResource.DATA,
      victoryPoints: {resourcesHere: {}, per: 3},

      metadata: {
        cardNumber: 'M86',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 1 steel to add 2 data resources to ANY card.', (eb) => eb.startAction.steel(1).arrow().resource(CardResource.DATA, 2).asterix());
          b.br;
          b.vpText('1 VP for every 3 data resources here.');
        }),
      },
    });
  }
}
