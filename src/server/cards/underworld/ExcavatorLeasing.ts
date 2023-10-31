import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Tag} from '../../../common/cards/Tag';

export class ExcavatorLeasing extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.EXCAVATOR_LEASING,
      tags: [Tag.MARS, Tag.BUILDING],
      cost: 8,

      metadata: {
        cardNumber: 'U35',
        renderData: CardRenderer.builder((b) => {
          b.text('Effect: The excavate standard project costs 1 M€ less for all players.').br;
          b.text('Effect: When any player excavates underground resources, you gain 1 M€ per excavation.').br;
        }),
      },
    });
  }
}
