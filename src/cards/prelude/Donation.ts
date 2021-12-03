import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class Donation extends PreludeCard {
  constructor() {
    super({
      name: CardName.DONATION,

      startingMegacredits: 21,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.megacredits(21);
        }),
        description: 'Gain 21 M€.',
      },
    });
  }
  public play(player: Player) {
    player.megaCredits += 21;
    return undefined;
  }
}

