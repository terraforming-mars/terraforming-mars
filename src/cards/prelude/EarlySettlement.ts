import {Tags} from '../Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';

export class EarlySettlement extends PreludeCard {
  constructor() {
    super({
      name: CardName.EARLY_SETTLEMENT,
      tags: [Tags.BUILDING, Tags.CITY],

      metadata: {
        cardNumber: 'P09',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.plants(1)).city();
        }),
        description: 'Increase your plant production 1 step. Place a city tile.',
      },
    });
  }
  public play(player: Player) {
    player.addProduction(Resources.PLANTS, 1);
    player.game.defer(new PlaceCityTile(player));
    return undefined;
  }
}

