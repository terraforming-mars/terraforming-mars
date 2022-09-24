import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
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
      reserveUnits: {titanium: 1},

      behavior: {
        production: {energy: -1, plants: 1},
        moon: {habitatTile: {}},
      },

      metadata: {
        description: 'Decrease your energy production 1 step and increase your plant production 1 step. ' +
        'Spend 1 titanium. Place a habitat tile on The Moon and raise the Habitat Rate 1 step.',
        cardNumber: 'M06',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).nbsp.plants(1);
          }).br;
          b.minus().titanium(1).br;
          b.moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE});
        }),
      },
      tilesBuilt: [TileType.MOON_HABITAT],
    });
  }
}
