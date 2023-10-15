import {TileType} from '../../../common/TileType';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';

export class MoholeArea extends Card implements IProjectCard {
  constructor(
    name = CardName.MOHOLE_AREA,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '142',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.heat(4, {digit})).br;
        b.tile(TileType.MOHOLE_AREA, true);
      }),
      description: 'Increase your heat production 4 steps. Place this tile ON AN AREA RESERVED FOR OCEAN.',
    }) {
    super({
      type: CardType.AUTOMATED,
      name,
      tags: [Tag.BUILDING],
      cost: 20,
      metadata,

      behavior: {
        production: {heat: 4},
        tile: {
          type: TileType.MOHOLE_AREA,
          on: 'ocean',
          adjacencyBonus: adjacencyBonus,
        },
      },
    });
  }
}
