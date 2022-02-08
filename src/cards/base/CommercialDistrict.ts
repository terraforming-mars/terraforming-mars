import {IProjectCard} from '../IProjectCard';
import {Tags} from '../../common/cards/Tags';
import {Card} from '../Card';
import {CardType} from '../../common/cards/CardType';
import {Player} from '../../Player';
import {TileType} from '../../common/TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../common/Resources';
import {CardName} from '../../common/cards/CardName';
import {Board} from '../../boards/Board';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Units} from '../../common/Units';

export class CommercialDistrict extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.COMMERCIAL_DISTRICT,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
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
      tags: [Tags.BUILDING],
      cost: 16,
      adjacencyBonus,
      productionBox: Units.of({energy: -1, megacredits: 4}),
      victoryPoints: 'special',
      metadata,
    });
  }

  public override canPlay(player: Player): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 &&
      player.game.board.getAvailableSpacesOnLand(player).length > 0;
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
  public play(player: Player) {
    return new SelectSpace(
      'Select space for special tile',
      player.game.board.getAvailableSpacesOnLand(player),
      (foundSpace: ISpace) => {
        player.game.addTile(player, foundSpace.spaceType, foundSpace, {
          tileType: TileType.COMMERCIAL_DISTRICT,
          card: this.name,
        });
        foundSpace.adjacency = this.adjacencyBonus;
        player.addProduction(Resources.ENERGY, -1);
        player.addProduction(Resources.MEGACREDITS, 4);
        return undefined;
      },
    );
  }
}
