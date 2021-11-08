import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';

export class HydrogenBombardment extends PreludeCard {
  constructor() {
    super({
      name: CardName.HYDROGEN_BOMBARDMENT,

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.titanium(1)).br;
          b.megacredits(6);
        }),
        description: 'Increase the Venus scale 1 step. Increase your titanium production 1 step. Gain 6 M€.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1);
    player.addResource(Resources.MEGACREDITS, 6);
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}

