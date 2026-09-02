import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class MicroprobingTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MICROPROBING_TECHNOLOGY,
      tags: [Tag.SCIENCE],
      cost: 8,

      requirements: {tag: Tag.SCIENCE},

      behavior: {
        stock: {plants: 3},
        underworld: {identify: {count: 2, claim: 1}},
      },

      metadata: {
        cardNumber: 'U022',
        renderData: CardRenderer.builder((b) => {
          b.plants(3, {digit}).identify(2, {digit}).claim(1);
        }),
        description: 'Requires 1 science tag. Gain 3 plants. Identify 2 underground resources. Claim 1 of them.',
      },
    });
  }
}
