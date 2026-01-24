import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {max} from '../Options';

export class NaturalPreserve extends Card implements IProjectCard {
  constructor(
    name = CardName.NATURAL_PRESERVE,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '044',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.megacredits(1)).nbsp.tile(TileType.NATURAL_PRESERVE, true).asterix();
      }),
      description: 'Oxygen must be 4% or less. Place this tile NEXT TO NO OTHER TILE. Increase your M€ production 1 step.',
    }) {
    super({
      type: CardType.AUTOMATED,
      name,
      tags: [Tag.SCIENCE, Tag.BUILDING],
      cost: 9,

      behavior: {
        production: {megacredits: 1},
        tile: {
          type: TileType.NATURAL_PRESERVE,
          on: 'isolated',
          adjacencyBonus: adjacencyBonus,
        },
      },

      adjacencyBonus,
      requirements: {oxygen: 4, max},
      victoryPoints: 1,
      metadata,
    });
  }
}
