import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {TileType} from '../../../common/TileType';
import {AltSecondaryTag} from '../../../common/cards/render/AltSecondaryTag';

export class TheWomb extends Card {
  constructor() {
    super({
      name: CardName.THE_WOMB,
      cardType: CardType.AUTOMATED,
      tags: [Tag.CITY, Tag.MOON],
      cost: 16,

      behavior: {
        production: {energy: -2, megacredits: 4},
        moon: {
          habitatTile: {},
        },
      },
      reserveUnits: {titanium: 2},

      metadata: {
        description: 'Decrease your energy production 2 steps and increase your M€ production 4 steps. ' +
          'Spend 2 titanium. Place a habitat tile on The Moon and raise the Habitat Rate 1 step.',
        cardNumber: 'M08',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(2).nbsp.megacredits(4);
          }).br;
          b.minus().titanium(2).moonHabitat({secondaryTag: AltSecondaryTag.MOON_HABITAT_RATE});
        }),
      },
      tilesBuilt: [TileType.MOON_HABITAT],
    });
  }
}
