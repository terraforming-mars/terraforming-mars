import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Donation extends PreludeCard {
    public tags = [];
    public name = CardName.DONATION;

    public play(player: Player) {
      player.megaCredits += 21;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P08',
      renderData: CardRenderer.builder((b) => {
        b.megacredits(21);
      }),
      description: 'Gain 21 MC.',
    }
}

