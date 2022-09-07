import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {Tag} from '../../../common/cards/Tag';
import {PreludeCard} from '../prelude/PreludeCard';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {IProjectCard} from '../IProjectCard';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class FirstLunarSettlement extends PreludeCard implements IProjectCard {
  constructor() {
    super({
      name: CardName.FIRST_LUNAR_SETTLEMENT,
      tags: [Tag.CITY, Tag.MOON],
      tilesBuilt: [TileType.MOON_COLONY],

      behavior: {
        production: {megacredits: 1},
      },

      metadata: {
        description: 'Place a colony tile on the Moon and Raise the Colony Rate 1 step. Increase your M€ production 1 step.',
        cardNumber: '',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => pb.megacredits(1)).moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE});
        }),
      },
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
