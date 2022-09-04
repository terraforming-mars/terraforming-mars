import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';

export class AntiGravityTechnology extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.ANTI_GRAVITY_TECHNOLOGY,
      tags: [Tag.SCIENCE],
      cost: 14,
      victoryPoints: 3,

      requirements: CardRequirements.builder((b) => b.tag(Tag.SCIENCE, 7)),
      cardDiscount: {amount: 2},
      metadata: {
        description: 'Requires 7 science tags.',
        cardNumber: '150',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 2 M€ less for it.', (be) => be.empty().startEffect.megacredits(-2));
        }),
      },
    });
  }
}
