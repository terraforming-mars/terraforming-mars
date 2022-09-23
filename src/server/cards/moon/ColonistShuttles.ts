import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {Size} from '../../../common/cards/render/Size';
import {all} from '../Options';

export class ColonistShuttles extends Card {
  constructor() {
    super({
      name: CardName.COLONIST_SHUTTLES,
      cardType: CardType.AUTOMATED,
      tags: [Tag.SPACE],
      cost: 12,
      reserveUnits: {titanium: 1},

      behavior: {
        moon: {colonyRate: 1},
        stock: {megacredits: {moon: {colony: {}}, each: 2}},
      },

      metadata: {
        description: 'Spend 1 titanium. Raise the Colony Rate 1 step. Gain 2M€ for each colony tile on The Moon.',
        cardNumber: 'M16',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonColonyRate().br;
          b.megacredits(2).slash().moonColony({size: Size.SMALL, all});
        }),
      },
      tilesBuilt: [TileType.MOON_COLONY],
    });
  }
}
