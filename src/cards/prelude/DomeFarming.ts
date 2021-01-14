import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';

export class DomeFarming extends PreludeCard {
  constructor() {
    super({
      name: CardName.DOME_FARMING,
      tags: [Tags.PLANT, Tags.BUILDING],

      metadata: {
        cardNumber: 'P07',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(2).plants(1));
        }),
        description: 'Increase your MC production 2 steps and plant production 1 step.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS);
    player.addProduction(Resources.MEGACREDITS, 2);
    return undefined;
  }
}

