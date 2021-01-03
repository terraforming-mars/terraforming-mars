import {IProjectCard} from '../IProjectCard';
import {Tags} from '../Tags';
import {Card} from '../Card';
import {CardType} from '../CardType';
import {Player} from '../../Player';
import {Game} from '../../Game';
import {TileType} from '../../TileType';
import {SelectSpace} from '../../inputs/SelectSpace';
import {ISpace} from '../../boards/ISpace';
import {Resources} from '../../Resources';
import {CardName} from '../../CardName';
import {Board} from '../../boards/Board';
import {IAdjacencyBonus} from '../../ares/IAdjacencyBonus';
import {CardMetadata} from '../CardMetadata';
import {CardRenderer} from '../render/CardRenderer';
import {CardRenderItemSize} from '../render/CardRenderItemSize';
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';

export class CommercialDistrict extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.COMMERCIAL_DISTRICT,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '085',
      description: 'Decrease your energy production 1 step and increase your MC production 4 steps.',
      renderData: CardRenderer.builder((b) => {
        b.productionBox((pb) => {
          pb.minus().energy(1).br;
          pb.plus().megacredits(4).br;
        }).nbsp.nbsp.tile(TileType.COMMERCIAL_DISTRICT, true).br;
        b.text('Place this tile. 1 vp per adjacent city tile', CardRenderItemSize.TINY, true);
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 1),
    },
  ) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.BUILDING],
      cost: 16,
      hasRequirements: false,
      adjacencyBonus,

      metadata,
    });
  }
  // public adjacencyBonus?: IAdjacencyBonus = undefined;

  public canPlay(player: Player, game: Game): boolean {
    return player.getProduction(Resources.ENERGY) >= 1 &&
      game.board.getAvailableSpacesOnLand(player).length > 0;
  }
  public getVictoryPoints(_player: Player, game: Game) {
    const usedSpace = game.board.getSpaceByTileCard(this.name);
    if (usedSpace !== undefined) {
      return game.board.getAdjacentSpaces(usedSpace).filter(
        (adjacentSpace) => Board.isCitySpace(adjacentSpace),
      ).length;
    }
    return 0;
  }
  public play(player: Player, game: Game) {
    return new SelectSpace(
      'Select space for special tile',
      game.board.getAvailableSpacesOnLand(player),
      (foundSpace: ISpace) => {
        game.addTile(player, foundSpace.spaceType, foundSpace, {
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
