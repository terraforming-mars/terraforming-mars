import {CardName} from '../../CardName';
import {Player} from '../../Player';
import {CardType} from '../CardType';
import {Tags} from '../Tags';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../TileType';
import {AltSecondaryTag} from '../render/CardRenderItem';

export class SphereHabitats extends MoonCard {
  constructor() {
    super({
      name: CardName.SPHERE_HABITATS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.CITY, Tags.MOON],
      cost: 14,
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonColony: 1},

      metadata: {
        description: 'Spend 1 titanium. Place a colony tile on the Moon and raise the Colony Rate 1 step.',
        cardNumber: 'M07',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).br;
          b.moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE});
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  };

  public override play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
