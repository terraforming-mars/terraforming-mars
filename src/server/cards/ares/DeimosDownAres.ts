import {CardName} from '../../../common/cards/CardName';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {all, digit} from '../Options';
import {DeimosDownPromo} from '../promo/DeimosDownPromo';

export class DeimosDownAres extends DeimosDownPromo {
  constructor() {
    super(
      CardName.DEIMOS_DOWN_ARES,
      {bonus: [SpaceBonus.ASTEROID, SpaceBonus.STEEL]},
      {
        cardNumber: 'A26',
        renderData: CardRenderer.builder((b) => {
          b.temperature(3).br;
          b.tile(TileType.DEIMOS_DOWN, false, true).asterix().br;
          b.steel(4, {digit}).nbsp.minus().plants(-6, {all});
        }),
        description: 'Raise temperature 3 steps and gain 4 steel. Place this tile ADJACENT TO no city tile. It provides adjacency bonus of 1 asteroid and 1 steel. Remove up to 6 plants from any player.',
      });
  }
}
