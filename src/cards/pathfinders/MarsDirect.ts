import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {CorporationCard} from '../corporation/CorporationCard';
import {IProjectCard} from '../IProjectCard';
import {played} from '../Options';
import {CardRenderer} from '../render/CardRenderer';
import {Tags} from '../Tags';

// TODO(kberg): This card is actually different: it uses resources to track on this card, which
// means this result can be changed by cards like CEO's Favorite Project.
// It also means cards with a wild tag may impact this.
export class MarsDirect extends Card implements CorporationCard {
  constructor() {
    super({
      cardType: CardType.CORPORATION,
      name: CardName.MARS_DIRECT,
      tags: [Tags.MARS],
      startingMegaCredits: 64,
      // For every new Mars card added reduce by 2, then 1 (aka reduce by 1.5)
      // 62, 61, 59, 58, 56, 55, 53, 52
      // Also change the value in description and renderData.

      metadata: {
        description: 'You start with 64 M€. (This is a temporary buff from 52M€ as many Mars tag cards are unimplemented)',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(64).br;
          b.corpBox('effect', (ce) => {
            ce.effect('When you play a Mars tag, you pay 1 M€ less for each Mars tag you have.', (eb) => {
              eb.mars(1, {played}).startEffect.megacredits(1).slash().mars(1, {played});
            });
          });
        }),
      },
    });
  }

  public play() {
    return undefined;
  }

  public getCardDiscount(player: Player, card: IProjectCard) {
    if (card.tags.indexOf(Tags.MARS) === -1) {
      return 0;
    }
    return player.getTagCount(Tags.MARS);
  }
}
