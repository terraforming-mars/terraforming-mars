import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {CardRenderer} from '../render/CardRenderer';
import {PlaceMoonMineTile} from '../../moon/PlaceMoonMineTile';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';
import {TileType} from '../../../common/TileType';

export class CoreMine extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.CORE_MINE,
      tags: [Tag.MOON],
      productionBox: {titanium: 1},
      tilesBuilt: [TileType.MOON_MINE],
      metadata: {
        description: 'Place a mine tile on the Moon and raise the Mining Rate 1 step. Increase your titanium production 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.titanium(1)).moonMine({secondaryTag: AltSecondaryTag.MOON_MINING_RATE});
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonMineTile(player));
    return undefined;
  }
}
