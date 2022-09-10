import {CardName} from '../../../common/cards/CardName';
import {Player} from '../../Player';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {PlaceMoonColonyTile} from '../../moon/PlaceMoonColonyTile';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {TileType} from '../../../common/TileType';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class GeodesicTents extends Card {
  constructor() {
    super({
      name: CardName.GEODESIC_TENTS,
      cardType: CardType.AUTOMATED,
      tags: [Tag.PLANT, Tag.CITY, Tag.MOON],
      cost: 13,

      behavior: {
        production: {energy: -1, plants: 1},
      },
      reserveUnits: {titanium: 1},
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
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }

  public override bespokePlay(player: Player) {
    player.game.defer(new PlaceMoonColonyTile(player));
    return undefined;
  }
}
