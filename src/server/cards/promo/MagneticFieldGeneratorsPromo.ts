import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {CardName} from '../../../common/cards/CardName';
import {TileType} from '../../../common/TileType';
import {CardRenderer} from '../render/CardRenderer';
import {digit} from '../Options';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';

export class MagneticFieldGeneratorsPromo extends Card implements IProjectCard {
  constructor(
    name = CardName.MAGNETIC_FIELD_GENERATORS_PROMO,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: 'X33',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(4, {digit}).br;
          pb.plus().plants(2);
        }).br;
        b.tr(3, {digit}).tile(TileType.MAGNETIC_FIELD_GENERATORS, true).asterix();
      }),
      description: 'Decrease your energy production 4 steps and increase your plant production 2 steps. Raise your TR 3 steps. Place this tile.',
    },
  ) {
    super({
      type: CardType.AUTOMATED,
      name: name,
      tags: [Tag.BUILDING],
      cost: 22,
      behavior: {
        production: {energy: -4, plants: 2},
        tr: 3,
        tile: {
          type: TileType.MAGNETIC_FIELD_GENERATORS,
          on: 'land',
          adjacencyBonus: adjacencyBonus,
        },
      },
      metadata,
    });
  }
}
