import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';

export class DeimosDownPromo extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.EVENT,
      name: CardName.DEIMOS_DOWN_PROMO,
      tags: [Tag.SPACE],
      cost: 31,

      behavior: {
        stock: {steel: 4},
        global: {temperature: 3},
        removeAnyPlants: 6,
        tile: {
          type: TileType.DEIMOS_DOWN,
          on: 'city',
        },
      },

      metadata: {
        cardNumber: 'X31',
        description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no other city tile. Remove up to 6 plants from any player.',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.tile(TileType.DEIMOS_DOWN, true).asterix().br;
          b.steel(4, {digit}).nbsp.minus().plants(-6, {all});
        }),
      },
    });
  }
}
