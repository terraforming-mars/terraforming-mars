import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {ICard} from '../ICard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {DiscardCards} from '../../deferredActions/DiscardCards';

export class PointLuna extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.POINT_LUNA,
      tags: [Tag.SPACE, Tag.EARTH],
      startingMegaCredits: 48,

      behavior: {
        production: {titanium: 1},
      },

      metadata: {
        cardNumber: 'R10',
        description: 'You start with 1 titanium production and 48 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(48);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, including this, draw a card then discard a card.', (eb) => {
              eb.tag(Tag.EARTH).startEffect.cards(1);
            });
          });
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
    const tagCount = player.tags.cardTagCount(card, Tag.EARTH);
    for (let i = 0; i < tagCount; i++) {
      player.drawCard();
      player.game.defer(new DiscardCards(player, 1, 1));
    }
  }
}
