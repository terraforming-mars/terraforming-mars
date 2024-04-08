import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class OceanFarm extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OCEAN_FARM,
      tags: [Tag.PLANT, Tag.BUILDING],
      cost: 15,

      behavior: {
        production: {plants: 1, heat: 1},
        tile: {
          type: TileType.OCEAN_FARM,
          on: 'upgradeable-ocean',
          adjacencyBonus: {bonus: [SpaceBonus.PLANT]},
        },
      },

      requirements: {oceans: 4},
      metadata: {
        cardNumber: 'A21',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.heat(1).br;
            pb.plants(1);
          }).nbsp.tile(TileType.OCEAN_FARM, false, true);
        }),
        description: 'Requires 4 ocean tiles. Increase your heat production 1 step and increase your plant production 1 step. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 plant.',
      },
    });
  }
}
