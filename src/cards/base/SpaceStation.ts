import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class SpaceStation extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.SPACE_STATION,
      tags: [Tags.SPACE],
      cost: 10,
      victoryPoints: 1,

      cardDiscount: {tag: Tags.SPACE, amount: 2},
      metadata: {
        cardNumber: '025',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play a Space card, you pay 2 M€ less for it.', (eb) => {
            eb.space({played}).startEffect.megacredits(-2);
          });
        }),
      },
    });
  }

  public getCardDiscount(_player: Player, card: IProjectCard) {
    if (card.tags.includes(Tags.SPACE)) {
      return 2;
    }
    return 0;
  }
  public play() {
    return undefined;
  }
}

