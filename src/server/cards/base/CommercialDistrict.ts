import {IProjectCard} from '../IProjectCard';
import {Tag} from '../../../common/cards/Tag';
import {Card} from '../Card';
import {CardType} from '../../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {CardName} from '../../../common/cards/CardName';
import {Board} from '../../boards/Board';
import {AdjacencyBonus} from '../../ares/AdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class CommercialDistrict extends Card implements IProjectCard {
  constructor(
    name = CardName.COMMERCIAL_DISTRICT,
    adjacencyBonus: AdjacencyBonus | undefined = undefined,
    metadata = {
      cardNumber: '085',
      description: 'Place this tile. Decrease your energy production 1 step and increase your M€ production 4 steps.',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().megacredits(4).br;
        }).nbsp.nbsp.tile(TileType.COMMERCIAL_DISTRICT, true).br;
        b.vpText('1 VP per adjacent city tile.');
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 1, true),
    },
  ) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tag.BUILDING],
      cost: 16,
      adjacencyBonus,

      behavior: {
        production: {energy: -1, megacredits: 4},
      },

      victoryPoints: 'special',
      metadata,
    });
  }

  public override bespokeCanPlay(player: Player): boolean {
    return player.game.board.getAvailableSpacesOnLand(player).length > 0;
  }
  public override getVictoryPoints(player: Player) {
    const usedSpace = player.game.board.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      return player.game.board.getAdjacentSpaces(usedSpace).filter(
        (adjacentSpace) => Board.isCitySpace(adjacentSpace),
      ).length;
    }
    return 0;
  }
  public override bespokePlay(player: Player) {
    return new SelectSpace(
      'Select space for special tile',
      player.game.board.getAvailableSpacesOnLand(player),
      (space: ISpace) => {
        player.game.addTile(player, space.spaceType, space, {
          tileType: TileType.COMMERCIAL_DISTRICT,
          card: this.name,
        });
        space.adjacency = this.adjacencyBonus;
        return undefined;
      },
    );
  }
}
