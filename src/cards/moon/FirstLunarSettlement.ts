import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {Resources} from '../../Resources';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {IProjectCard} from '../IProjectCard';

export class FirstLunarSettlement extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.FIRST_LUNAR_SETTLEMENT,
      tags: [Tags.CITY, Tags.MOON],
      metadata: {
        description: 'Place a colony tile on the Moon and Raise the Colony Rate 1 step. Increase your MC production 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).tile(TileType.MOON_COLONY, false);
        }),
      },
    });
  }

  public tilesBuilt = [TileType.MOON_COLONY];

  public play(player: Player) {
    player.addProduction(Resources.MEGACREDITS, 1, player.game);
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
