import {Tag} from '../../../common/cards/Tag';
import {IPlayer} from '../../IPlayer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {played} from '../Options';

export class PointLuna extends CorporationCard {
  constructor() {
    super({
      name: CardName.POINT_LUNA,
      tags: [Tag.SPACE, Tag.EARTH],
      startingMegaCredits: 38,

      behavior: {
        production: {titanium: 1},
        drawCard: 1,
      },

      metadata: {
        cardNumber: 'R10',
        description: 'You start with 1 titanium production and 38 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br;
          b.production((pb) => pb.titanium(1)).nbsp.megacredits(38);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play an Earth tag, including this, draw a card.', (eb) => {
              eb.earth(1, {played}).startEffect.cards(1);
            });
          });
        }),
      },
    });
  }
  public onCorpCardPlayed(player: IPlayer, card: ICorporationCard) {
    return this.onCardPlayed(player, card);
  }

  public onCardPlayed(player: IPlayer, card: IProjectCard | ICorporationCard) {
    if (player.isCorporation(this.name)) {
      const tagCount = player.tags.cardTagCount(card, Tag.EARTH);
      if (tagCount > 0) {
        player.drawCard(tagCount);
      }
    }
    return undefined;
  }
}
