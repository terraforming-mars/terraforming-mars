import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';
import {IProjectCard} from '../IProjectCard';
import {CardType} from '../../../common/cards/CardType';
import {Card} from '../Card';

export class RobotMoles extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.ROBOT_MOLES,
      cost: 8,
      tags: [Tag.BUILDING],

      behavior: {
        stock: {steel: 2},
        underworld: {identify: {count: 4, claim: 1}},
      },

      metadata: {
        cardNumber: 'U45',
        renderData: CardRenderer.builder((b) => b.steel(2).identify(4).claim(1)),
        description: 'Gain 2 steel. Identify 4 underground resources. Claim 1 of them.',
      },
    });
  }
}

