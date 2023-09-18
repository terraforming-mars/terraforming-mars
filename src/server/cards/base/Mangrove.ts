import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRequirements} from '../requirements/CardRequirements';
import {CardRenderer} from '../render/CardRenderer';

export class Mangrove extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.MANGROVE,
      tags: [Tag.PLANT],
      cost: 12,
      tr: {oxygen: 1},
      victoryPoints: 1,

      behavior: {
        greenery: {on: 'ocean'},
      },

      requirements: CardRequirements.builder((b) => b.temperature(4)),
      metadata: {
        cardNumber: '059',
        renderData: CardRenderer.builder((b) => b.greenery().asterix()),
        description: 'Requires +4 C or warmer. Place a greenery tile ON AN AREA RESERVED FOR OCEAN and raise oxygen 1 step. Disregard normal placement restrictions for this.',
      },
    });
  }
}
