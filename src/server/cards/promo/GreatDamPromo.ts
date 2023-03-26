import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardRequirements} from '../CardRequirements';
import {CardRenderer} from '../render/CardRenderer';
import {Card} from '../Card';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';

export class GreatDamPromo extends Card implements IProjectCard {
  constructor(
    name = CardName.GREAT_DAM_PROMO,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: 'X32',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => pb.energy(2)).tile(TileType.GREAT_DAM, true, false).asterix();
      }),
      description: 'Requires 4 ocean tiles. Increase your energy production 2 steps. Place this tile ADJACENT TO an ocean tile.',
    },
  ) {
    super({
      type: CardType.AUTOMATED,
      name,
      cost: 15,
      tags: [Tag.POWER, Tag.BUILDING],
      metadata,

      behavior: {
        production: {energy: 2},
        tile: {
          type: TileType.GREAT_DAM,
          on: 'ocean',
          adjacencyBonus: adjacencyBonus,
        },
      },

      requirements: CardRequirements.builder((b) => b.oceans(4)),
      victoryPoints: 1,
    });
  }
}

