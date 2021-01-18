import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {Tags} from '../Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../TileType';
import {Resources} from '../../Resources';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {IProjectCard} from '../IProjectCard';

export class CoreMine extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORE_MINE,
      tags: [Tags.MOON],
      metadata: {
        description: 'Place a mine tile on the Moon and raise Mining Rate 1 step. Increase your titanium production 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).tile(TileType.MOON_MINE, false);
        }),
      },
    });
  }

  public play(player: Player) {
    player.addProduction(Resources.TITANIUM, 1, player.game);
    player.game.defer(new PlaceMoonMineTile(player));
    return undefined;
  }
}
