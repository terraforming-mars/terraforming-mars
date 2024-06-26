import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {IPlayer} from '../../IPlayer';
import {TileType} from '../../../common/TileType';
import {CardName} from '../../../common/cards/CardName';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {Board} from '../../boards/Board';
import {CardMetadata} from '../../../common/cards/CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class Capital extends Card implements IProjectCard {
  constructor(
    name = CardName.CAPITAL,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '008',
      description: {
        text: 'Requires 4 ocean tiles. Place this tile. Decrease your energy production 2 steps and increase your M€ production 5 steps.',
        align: 'left',
      },
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(2).br;
          pb.plus().megacredits(5);
        }).nbsp.tile(TileType.CAPITAL, false).br;
        b.vpText('1 additional VP for each ocean tile adjacent to this city tile.');
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.oceans(1, 1),
    },
  ) {
    super({
      type: CardType.AUTOMATED,
      name,
      tags: [Tag.CITY, Tag.BUILDING],
      cost: 26,

      behavior: {
        production: {energy: -2, megacredits: 5},
        tile: {
          type: TileType.CAPITAL,
          on: 'city',
          title: 'Select space for special city tile',
          adjacencyBonus: adjacencyBonus,
        },
      },

      requirements: {oceans: 4},
      victoryPoints: 'special',
      metadata,
    });
  }
  public override getVictoryPoints(player: IPlayer) {
    const usedSpace = player.game.board.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      return player.game.board.getAdjacentSpaces(usedSpace)
        .filter((s) => Board.isOceanSpace(s)).length;
    }
    return 0;
  }
}
