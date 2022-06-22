import {CardName} from '../../common/cards/CardName';
import {SpaceBonus} from '../../common/boards/SpaceBonus';
import {LavaFlows} from '../base/LavaFlows';
import {TileType} from '../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';

export class LavaFlowsAres extends LavaFlows {
  constructor() {
    super(
      CardName.LAVA_FLOWS_ARES,
      {bonus: [SpaceBonus.HEAT, SpaceBonus.HEAT]},
      {
        cardNumber: 'A11',
        renderData: CardRenderer.builder((b) => {
          b.temperature(2).br;
          b.tile(TileType.LAVA_FLOWS, false, true);
        }),
        description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS. This tile grants an ADJACENCY BONUS of 2 heat.',
      });
  }
}
