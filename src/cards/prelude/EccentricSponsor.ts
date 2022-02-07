import {Player} from '../../Player';
import {CardName} from '../../common/cards/CardName';
import {PreludeCard} from './PreludeCard';
import {PlayProjectCard} from '../../deferredActions/PlayProjectCard';
import {CardRenderer} from '../render/CardRenderer';
import {Size} from '../render/Size';

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
  public getCardDiscount(player: Player) {
    if (player.lastCardPlayed === this.name) {
      return 25;
    }
    return 0;
  }

  public play(player: Player) {
    player.game.defer(new PlayProjectCard(player));
    return undefined;
  }
}
