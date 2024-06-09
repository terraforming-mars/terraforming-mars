import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {CardResource} from '../../../common/CardResource';
import {SpaceBonus} from '../../../common/boards/SpaceBonus';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';
import {IProjectCard} from '../IProjectCard';

export class OceanSanctuary extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.ACTIVE,
      name: CardName.OCEAN_SANCTUARY,
      tags: [Tag.ANIMAL],
      cost: 9,
      resourceType: CardResource.ANIMAL,
      victoryPoints: {resourcesHere: {}},
      requirements: {oceans: 5},

      behavior: {
        addResources: 1,
        tile: {
          type: TileType.OCEAN_SANCTUARY,
          on: 'upgradeable-ocean',
          adjacencyBonus: {bonus: [SpaceBonus.ANIMAL]},
        },
      },

      metadata: {
        cardNumber: 'A22',
        renderData: CardRenderer.builder((b) => {
          b.tile(TileType.OCEAN_SANCTUARY, false, true).nbsp.resource(CardResource.ANIMAL).br;
          b.vpText('1 VP per animal on this card.');
        }),
        description: 'Requires 5 ocean tiles. Place this tile on top of an existing ocean tile. The tile grants an ADJACENCY BONUS of 1 animal. Add 1 animal to this card.',
      },
    });
  }
}
