import {IPlayer} from '../../IPlayer';
import {CardName} from '../../../common/cards/CardName';
import {PreludeCard} from './PreludeCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../../../common/cards/render/Size';
import {PreludesExpansion} from '../../preludes/PreludesExpansion';

export class EccentricSponsor extends PreludeCard {
  constructor() {
    super({
      name: CardName.ECCENTRIC_SPONSOR,

      metadata: {
        cardNumber: 'P11',
        renderData: CardRenderer.builder((b) => {
          b.text('Play a card from hand, reducing its cost by 25 M€', Size.SMALL, true);
        }),
      },
    });
  }

  // TODO(kberg): Make it possible to identify that the prelude will fizzle during canPlay, which
  // will present a warning to the player.

  public override getCardDiscount(player: IPlayer) {
    if (player.lastCardPlayed === this.name) {
      return 25;
    }
    return 0;
  }

  public override bespokePlay(player: IPlayer) {
    player.game.defer(new PlayProjectCard(player))
      .andThen((card) => {
        if (card === undefined) {
          PreludesExpansion.fizzle(player, this);
          // If this card fizzles, don't apply the discount to the next card.
          player.lastCardPlayed = undefined;
        }
      });
    return undefined;
  }
}
