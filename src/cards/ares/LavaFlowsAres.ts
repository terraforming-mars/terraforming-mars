import {CardName} from '../../CardName';
import {SpaceBonus} from '../../SpaceBonus';
import {LavaFlows} from '../base/LavaFlows';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {TileType} from '../../TileType';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';

export class LavaFlowsAres extends LavaFlows {
  public name = CardName.LAVA_FLOWS_ARES;
  public adjacencyBonus: IAdjacencyBonus = {bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]}
  public metadata: CardMetadata = {
    cardNumber: 'A11',
    renderData: CardRenderer.builder((b) => {
      b.temperature(2).br;
      b.tile(TileType.LAVA_FLOWS, false, true);
    }),
    description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS. This tile grants an ADJACENCY BONUS of 2 heat.',
  }
}
