import {IProjectCard} from '../IProjectCard';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {TileType} from '../../../common/TileType';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class LavaFlows extends Card implements IProjectCard {
  constructor(
    name = CardName.LAVA_FLOWS,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '140',
      renderData: CardRenderer.builder((b) => {
        b.temperature(2).br;
        b.tile(TileType.LAVA_FLOWS, true, false).asterix();
      }),
      description: 'Raise temperature 2 steps and place this tile ON EITHER THARSIS THOLUS, ASCRAEUS MONS, PAVONIS MONS OR ARSIA MONS.',
    }) {
    super({
      type: CardType.EVENT,
      name,
      cost: 18,
      adjacencyBonus,

      behavior: {
        global: {temperature: 2},
        tile: {
          type: TileType.LAVA_FLOWS,
          on: 'volcanic',
          title: 'Select either Tharsis Tholus, Ascraeus Mons, Pavonis Mons or Arsia Mons',
          adjacencyBonus: adjacencyBonus,
        },
      },
      metadata,
    });
  }
}
