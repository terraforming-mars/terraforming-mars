import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';


export class Habitat14 extends Card {
  constructor() {
    super({
      name: CardName.HABITAT_14,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.MOON],
      cost: 5,

      behavior: {
        production: {energy: -1, megacredits: -1},
        moon: {habitatTile: {}},
      },
      reserveUnits: {titanium: 1},

      metadata: {
        description: 'Decrease your energy production 1 step and your M€ production 1 step. Spend 1 titanium. Place a habitat tile on The Moon and raise the Habitat Rate 1 step.',
        cardNumber: 'M05',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).minus().megacredits(1);
          }).br;
          b.minus().titanium(1).br;
          b.moonHabitat();
        }),
      },
      tilesBuilt: [TileType.MOON_HABITAT],
    });
  }
}
