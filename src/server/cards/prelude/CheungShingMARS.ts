import {Tag} from '../../../common/cards/Tag';
import {CorporationCard} from '../corporation/CorporationCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {Resource} from '../../../common/Resource';
import {ICard} from '../ICard';
import {IPlayer} from '../../IPlayer';

export class CheungShingMARS extends CorporationCard implements ICorporationCard {
  constructor() {
    super({
      name: CardName.CHEUNG_SHING_MARS,
      tags: [Tag.BUILDING],
      startingMegaCredits: 44,

      behavior: {
        production: {megacredits: 3},
      },

      cardDiscount: {tag: Tag.BUILDING, amount: 2},
      metadata: {
        cardNumber: 'R16',
        description: 'You start with 3 M€ production and 44 M€.',
        renderData: CardRenderer.builder((b) => {
          b.br.br;
          b.production((pb) => pb.megacredits(3)).nbsp.megacredits(44);
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a building tag, including this, you gain 3 M€.', (eb) => {
              eb.tag(Tag.BUILDING).startEffect.megacredits(3);
            });
          });
        }),
      },
    });
  }

  public onCardPlayedForCorps(player: IPlayer, card: ICard) {
      if (card.tags.includes(Tag.BUILDING)) {
        player.stock.add(Resource.MEGACREDITS, 3, {log: true, from: {card: this}});
      }
    }
}
