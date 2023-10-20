import {Card} from '../Card';
import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardType} from '../../../common/cards/CardType';
import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {CardRenderer} from '../render/CardRenderer';

export class OceanCity extends Card implements IProjectCard {
  constructor() {
    super({
      type: CardType.AUTOMATED,
      name: CardName.OCEAN_CITY,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 18,

      behavior: {
        production: {energy: -1, megacredits: 3},
        tile: {
          type: TileType.OCEAN_CITY,
          on: 'upgradeable-ocean',
        },
      },

      requirements: {oceans: 6},
      metadata: {
        cardNumber: 'A20',
        renderData: CardRenderer.builder((b) => {
          b.production((pb) => {
            pb.minus().energy(1).br;
            pb.plus().megacredits(3);
          }).nbsp.tile(TileType.OCEAN_CITY, false, true);
        }),
        description: 'Requires 6 ocean tiles. Decrease your energy production 1 step and increase your M€ production 3 steps. Place this tile on top of an existing ocean tile, IGNORING NORMAL PLACEMENT RESTRICTIONS FOR CITIES. The tile counts as a city as well as an ocean.',
      },
    });
  }
}
