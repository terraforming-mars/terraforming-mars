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
        moon: {habitatRate: 1},
        stock: {megacredits: {moon: {habitat: {}}, each: 2}},
      },

      metadata: {
        description: 'Spend 1 titanium. Raise the Habitat Rate 1 step. Gain 2M€ for each habitat tile on The Moon.',
        cardNumber: 'M16',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(1).moonHabitatRate().br;
          b.megacredits(2).slash().moonHabitat({size: Size.SMALL, all});
        }),
      },
      tilesBuilt: [TileType.MOON_HABITAT],
    });
  }
}
