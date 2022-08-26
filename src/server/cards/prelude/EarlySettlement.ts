import {Tag} from '../../../common/cards/Tag';
import {Player} from '../../Player';
import {PreludeCard} from './PreludeCard';
import {CardName} from '../../../common/cards/CardName';
import {PlaceCityTile} from '../../deferredActions/PlaceCityTile';
import {CardRenderer} from '../render/CardRenderer';

export class EarlySettlement extends PreludeCard {
  public migrated = true;
  constructor() {
    super({
      name: CardName.EARLY_SETTLEMENT,
      tags: [Tag.BUILDING, Tag.CITY],
      productionBox: {plants: 1},

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
    player.game.defer(new PlaceCityTile(player));
    return undefined;
  }
}

