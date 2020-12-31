import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class SupplyDrop extends PreludeCard {
    public tags = [];
    public name = CardName.SUPPLY_DROP;

    public play(player: Player) {
      player.titanium +=3;
      player.steel +=8;
      player.plants +=3;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P33',
      renderData: CardRenderer.builder((b) => {
        b.titanium(3).digit.steel(8).digit.plants(3).digit;
      }),
      description: 'Gain 3 titanium, 8 steel and 3 plants.',
    }
}
