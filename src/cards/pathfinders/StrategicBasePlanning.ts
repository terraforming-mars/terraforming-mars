import {Player} from '../../Player';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardName} from '../../CardName';
import {CardRenderer} from '../render/CardRenderer';
import {Resources} from '../../Resources';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {BuildColony} from '../../deferredActions/BuildColony';
import {Tags} from '../Tags';

export class StrategicBasePlanning extends PreludeCard {
  constructor() {
    super({
      name: CardName.STRATEGIC_BASE_PLANNING,
      tags: [Tags.BUILDING],

      metadata: {
        cardNumber: 'P08',
        renderData: CardRenderer.builder((b) => {
          b.minus().megacredits(8).city().colonies();
        }),
        description: 'Pay 8M€. Place a city. Place a colony.',
      },
    });
  }
  public play(player: Player) {
    player.deductResource(Resources.MEGACREDITS, 8);
    player.game.defer(new PlaceCityTile(player));
    player.game.defer(new BuildColony(player));
    return undefined;
  }
}

