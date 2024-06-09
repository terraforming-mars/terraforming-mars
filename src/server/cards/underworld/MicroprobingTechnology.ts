import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';
import {CardResource} from '../../../common/CardResource';

export class MicroprobingTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MICROPROBING_TECHNOLOGY,
      tags: [Tag.SCIENCE],
      cost: 7,

      requirements: {tag: Tag.SCIENCE, count: 1},

      behavior: {
        stock: {plants: 3},
        addResourcesToAnyCard: {count: 2, type: CardResource.DATA},
        underworld: {identify: 3},
      },

      metadata: {
        cardNumber: 'U22',
        renderData: CardRenderer.builder((b) => {
          b.plants(3, {digit}).resource(CardResource.DATA, {amount: 2, digit}).identify(3, {digit});
        }),
        description: 'Requires 1 science tag. Gain 3 plants. Add 2 data to any card. Identify 3 underground resources.',
      },
    });
  }
}
