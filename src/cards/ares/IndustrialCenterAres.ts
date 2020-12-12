import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {IndustrialCenter} from '../base/IndustrialCenter';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';


export class IndustrialCenterAres extends IndustrialCenter {
  public name = CardName.INDUSTRIAL_CENTER_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.STEEL]};
  public metadata: CardMetadata = {
    cardNumber: 'A10',
    renderData: CardRenderer.builder((b) => {
      b.effectBox((eb) => {
        eb.megacredits(7).startAction.productionBox((pb) => pb.steel(1));
        eb.description('Action: Spend 7 MC to increase your steel production 1 step.');
      }).br;
      b.tile(TileType.INDUSTRIAL_CENTER, false, true);
    }),
    description: 'Place this tile adjacent to a city tile. This tile grants an ADJACENCY BONUS of 1 steel.',
  }
}
