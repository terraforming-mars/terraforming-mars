import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {Card} from '../Card';
import {CardRenderer} from '../render/CardRenderer';

export class FloaterPrototypes extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 2,
      tags: [Tag.SCIENCE],
      name: CardName.FLOATER_PROTOTYPES,
      cardType: CardType.EVENT,

      behavior: {
        addResourcesToAnyCard: {type: CardResource.FLOATER, count: 2},
      },

      metadata: {
        cardNumber: 'C11',
        renderData: CardRenderer.builder((b) => b.floaters(2).asterix()),
        description: 'Add two floaters to ANOTHER card.',
      },
    });
  }
}
