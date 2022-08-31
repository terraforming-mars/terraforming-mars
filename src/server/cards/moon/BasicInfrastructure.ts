import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonRoadTile} from '../../moon/PlaceMoonRoadTile';

export class BasicInfrastructure extends PreludeCard {
  constructor() {
    super({
      name: CardName.BASIC_INFRASTRUCTURE,
      tags: [Tag.MOON],

      metadata: {
        description: 'Place a road tile on the Moon and raise the Logistics Rate 1 step. Gain 1 trade fleet.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.MOON_ROAD, false).tradeFleet();
        }),
      },
      tilesBuilt: [TileType.MOON_ROAD],
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonRoadTile(player));
    player.colonies.increaseFleetSize();
    return undefined;
  }
}
