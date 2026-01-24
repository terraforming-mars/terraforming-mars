import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';
import {digit} from '../Options';

export class Neutrinograph extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.NEUTRINOGRAPH,
      tags: [Tag.SCIENCE],
      cost: 14,

      requirements: {tag: Tag.SCIENCE, count: 5},
      victoryPoints: 2,

      behavior: {
        underworld: {identify: {count: 7, claim: 3}},
      },

      metadata: {
        cardNumber: 'U057',
        renderData: CardRenderer.builder((b) => {
          b.identify(7, {digit}).claim(3);
        }),
        description: 'Requires 5 science tags. Identify 7 underground resources. Claim 3 of them.',
      },
    });
  }
}
