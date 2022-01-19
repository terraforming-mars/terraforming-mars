import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {BuildColony} from '../../deferredActions/BuildColony';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';

export class AerospaceMission extends PreludeCard {
  constructor() {
    super({
      name: CardName.AEROSPACE_MISSION,
      tags: [Tags.SPACE],
      startingMegacredits: -14,

      metadata: {
        cardNumber: 'Y01',
        renderData: CardRenderer.builder((b) => {
          b.colonies(1).nbsp.colonies(1).br;
          b.minus().megacredits(14);
        }),
        description: 'Place 2 colonies. Pay 14 M€.',
      },
    });
  }

  public override canPlay(player: Player) {
    return player.canAfford(14);
  }

  public play(player: Player) {
    player.deductResource(Resources.MEGACREDITS, 14);
    player.game.defer(new BuildColony(player, false, 'Select where to build the first colony'));
    player.game.defer(new BuildColony(player, false, 'Select where to build the second colony'));
    return undefined;
  }
}
