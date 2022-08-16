import {CardName} from '../../../common/cards/CardName';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {IndustrialCenter} from '../base/IndustrialCenter';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';

export class IndustrialCenterAres extends IndustrialCenter {
  constructor() {
    super(
      CardName.INDUSTRIAL_CENTER_ARES,
      {bonus: [SpaceBonus.STEEL]},
      {
        cardNumber: 'A10',
        renderData: CardRenderer.builder((b) => {
          b.action('Spend 7 M€ to increase your steel production 1 step.', (eb) => {
            eb.megacredits(7).startAction.production((pb) => pb.steel(1));
          }).br;
          b.tile(TileType.INDUSTRIAL_CENTER, false, true).asterix();
        }),
        description: 'Place this tile adjacent to a city tile. This tile grants an ADJACENCY BONUS of 1 steel.',
      });
  }
}
