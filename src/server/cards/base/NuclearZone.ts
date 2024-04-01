import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {TileType} from '../../../common/TileType';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';

export class NuclearZone extends Card implements IProjectCard {
  constructor(
    name = CardName.NUCLEAR_ZONE,
    cost = 10,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '097',
      renderData: CardRenderer.builder((b) => {
        b.tile(TileType.NUCLEAR_ZONE, true).br;
        b.temperature(2);
      }),
      description: 'Place this tile and raise temperature 2 steps.',
    }) {
    super({
      type: CardType.AUTOMATED,
      name,
      tags: [Tag.EARTH],
      cost,
      behavior: {
        global: {temperature: 2},
        tile: {
          type: TileType.NUCLEAR_ZONE,
          on: 'land',
          adjacencyBonus: adjacencyBonus,
        },
      },
      metadata,
      victoryPoints: -2,
    });
  }
}
