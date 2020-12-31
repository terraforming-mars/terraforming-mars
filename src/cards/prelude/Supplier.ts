import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class Supplier extends PreludeCard {
    public tags = [Tags.ENERGY];
    public name = CardName.SUPPLIER;

    public play(player: Player) {
      player.addProduction(Resources.ENERGY, 2);
      player.steel +=4;
      return undefined;
    }
    public metadata: CardMetadata = {
      cardNumber: 'P32',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => pb.energy(2)).br;
        b.steel(4);
      }),
      description: 'Increase your energy production 2 steps. Gain 4 steel.',
    }
}
