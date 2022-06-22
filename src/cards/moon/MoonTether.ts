import {CardName} from '../../common/cards/CardName';
import {CardType} from '../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {CardRenderer} from '../render/CardRenderer';
import {CardRequirements} from '../CardRequirements';
import {Card} from '../Card';

export class MoonTether extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.MOON_TETHER,
      cardType: CardType.ACTIVE,
      tags: [Tags.MOON, Tags.SPACE],
      cost: 18,
      victoryPoints: 1,

      requirements: CardRequirements.builder((b) => b.tag(Tags.SPACE, 6)),
      cardDiscount: {amount: 2},
      metadata: {
        cardNumber: 'M90',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a card, you pay 2 M€ less for it.', (eb) => {
            eb.empty().startEffect.megacredits(-2);
          }).br;
        }),
        description: 'Requires 6 Space tags.',
      },
    });
  }

  public play() {
    return undefined;
  }
}
