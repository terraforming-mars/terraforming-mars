import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {ICorporationCard} from '../corporation/ICorporationCard';
import {IProjectCard} from '../IProjectCard';
import {played} from '../Options';
import {CardRenderer} from '../render/CardRenderer';
import {Tag} from '../../../common/cards/Tag';

// TODO(kberg): This card is actually different: it uses resources to track on this card, which
// means this result can be changed by cards like CEO's Favorite Project.
// It also means cards with a wild tag may impact this.
export class MarsDirect extends Card implements ICorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MARS_DIRECT,
      tags: [Tag.MARS],
      startingMegaCredits: 52,

      metadata: {
        description: 'You start with 52 M€.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(56).br;
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a Mars tag, you pay 1 M€ less for each Mars tag you have.', (eb) => {
              eb.mars(1, {played}).startEffect.megacredits(1).slash().mars(1, {played});
            });
          });
        }),
      },
    });
  }

  public override getCardDiscount(player: Player, card: IProjectCard) {
    if (card.tags.indexOf(Tag.MARS) === -1) {
      return 0;
    }
    return player.tags.count(Tag.MARS);
  }
}
