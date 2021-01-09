import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class EarthOffice extends Card implements IProjectCard {
  constructor() {
    super({
      cardType: CardType.ACTIVE,
      name: CardName.EARTH_OFFICE,
      tags: [Tags.EARTH],
      cost: 1,

      metadata: {
        cardNumber: '105',
        renderData: CardRenderer.builder((b) => {
          b.effect('When you play an Earth card, you pay 3 MC less for it.', (eb) => {
            eb.earth().played.startEffect.megacredits(-3);
          });
        }),
      },
    });
  }

  public getCardDiscount(_player: Player, _game: Game, card: IProjectCard) {
    return card.tags.filter((tag) => tag === Tags.EARTH).length * 3;
  }

  public play() {
    return undefined;
  }
}
