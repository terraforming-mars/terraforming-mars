import {CardName} from '../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../common/cards/CardType';
import {Tags} from '../../common/cards/Tags';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {Units} from '../../common/Units';
import {MoonCard} from './MoonCard';
import {TileType} from '../../common/TileType';
import {AltSecondaryTag} from '../../common/cards/render/AltSecondaryTag';

export class GeodesicTents extends MoonCard {
  constructor() {
    super({
      name: CardName.GEODESIC_TENTS,
      cardType: CardType.AUTOMATED,
      tags: [Tags.PLANT, Tags.CITY, Tags.MOON],
      cost: 13,
      productionBox: Units.of({energy: -1, plants: 1}),
      reserveUnits: Units.of({titanium: 1}),
      tr: {moonColony: 1},

      metadata: {
        description: 'Decrease your energy production 1 step and increase your plant production 1 step. ' +
        'Spend 1 titanium. Place a colony tile on the Moon and raise the Colony Rate 1 step.',
        cardNumber: 'M06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).nbsp.plants(1);
          }).br;
          b.minus().titanium(1).br;
          b.moonColony({secondaryTag: AltSecondaryTag.MOON_COLONY_RATE});
        }),
      },
    }, {
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public override play(player: Player) {
    super.play(player);
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
