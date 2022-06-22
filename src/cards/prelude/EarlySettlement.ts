import {Tags} from '../../common/cards/Tags';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';

export class EarlySettlement extends PreludeCard {
  constructor() {
    super({
      name: CardName.EARLY_SETTLEMENT,
      tags: [Tags.BUILDING, Tags.CITY],
      productionBox: Units.of({plants: 1}),

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

