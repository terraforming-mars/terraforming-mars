import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../../common/Resources';

export class HydrogenBombardment extends PreludeCard {
  constructor() {
    super({
      name: CardName.HYDROGEN_BOMBARDMENT,
      productionBox: {titanium: 1},
      startingMegacredits: 6,

      metadata: {
        cardNumber: 'P04',
        renderData: CardRenderer.builder((b) => {
          b.venus(1).br;
          b.production((pb) => pb.titanium(1)).br;
          b.megacredits(6);
        }),
        description: 'Increase the Venus scale 1 step. Increase your titanium production 1 step. Gain 6 M€.',
      },
    });
  }
  public override bespokePlay(player: Player) {
    player.addResource(Resources.MEGACREDITS, this.startingMegaCredits);
    player.game.increaseVenusScaleLevel(player, 1);
    return undefined;
  }
}

