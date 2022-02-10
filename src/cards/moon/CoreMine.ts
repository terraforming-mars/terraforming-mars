import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {Tags} from '../../common/cards/Tags';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../render/CardRenderItem';
import {Units} from '../../common/Units';
import {TileType} from '../../common/TileType';

export class CoreMine extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORE_MINE,
      tags: [Tags.MOON],
      productionBox: Units.of({titanium: 1}),
      metadata: {
        description: 'Place a mine tile on the Moon and raise the Mining Rate 1 step. Increase your titanium production 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE});
        }),
      },
    });
  }

  public tilesBuilt = [TileType.MOON_MINE];

  public play(player: Player) {
    player.adjustProduction(this.productionBox, {log: true});
    player.game.defer(new PlaceMoonMineTile(player));
    return undefined;
  }
}
