import {CardName} from '../../../common/cards/CardName';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {TileType} from '../../../common/TileType';

export class LunarIndustryComplex extends Card implements IProjectCard {
  constructor() {
    super({
      name: CardName.LUNAR_INDUSTRY_COMPLEX,
      cardType: CardType.AUTOMATED,
      tags: [Tag.ENERGY, Tag.BUILDING],
      cost: 28,

      behavior: {
        production: {steel: 1, titanium: 1, energy: 2, heat: 1},
        moon: {mineTile: {}},
      },
      reserveUnits: {titanium: 2},

      metadata: {
        description: 'Spend 2 Titanium. Place a mine tile on The Moon and raise the Mining Rate 1 step. ' +
          'Increase your steel, titanium, and heat production 1 step each. Increase your energy production 2 steps.',
        cardNumber: 'M74',
        renderData: CardRenderer.builder((b) => {
          b.minus().titanium(2).moonMine().br;
          b.production((pb) => pb.steel(1).titanium(1).heat(1).energy(2));
        }),
      },
      tilesBuilt: [TileType.MOON_MINE],
    });
  }
}
