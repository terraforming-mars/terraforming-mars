import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {CardRequirements} from '../CardRequirements';

export class SkyDocks extends Card implements IProjectCard {
  constructor() {
    super({
      cost: 18,
      tags: [Tag.SPACE, Tag.EARTH],
      name: CardName.SKY_DOCKS,
      cardType: CardType.ACTIVE,
      victoryPoints: 2,

      behavior: {
        colonies: {addTradeFleet: 1},
      },

      requirements: CardRequirements.builder((b) => b.tag(Tag.EARTH, 2)),
      cardDiscount: {amount: 1},
      metadata: {
        cardNumber: 'C36',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 1 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-1);
          }).br;
          b.tradeFleet();
        }),
        description: 'Requires 2 Earth tags. Gain 1 Trade Fleet.',
      },
    });
  }
}
