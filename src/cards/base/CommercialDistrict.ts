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
import {CardRenderDynamicVictoryPoints} from '../render/CardRenderDynamicVictoryPoints';
import {Units} from '../../Units';

export class CommercialDistrict extends Card implements IProjectCard {
  constructor(
    name: CardName = CardName.COMMERCIAL_DISTRICT,
    adjacencyBonus: IAdjacencyBonus | undefined = undefined,
    metadata: CardMetadata = {
      cardNumber: '085',
      description: 'Place this tile. Decrease your energy production 1 step and increase your MC production 4 steps.',
      renderData: CardRenderer.builder((b) => {
        b.production((pb) => {
          pb.minus().energy(1).br;
          pb.plus().megacredits(4).br;
        }).nbsp.nbsp.tile(TileType.COMMERCIAL_DISTRICT, true).br;
        b.vpText('1 VP per adjacent city tile.');
      }),
      victoryPoints: CardRenderDynamicVictoryPoints.cities(1, 1),
    },
  ) {
    super({
      cardType: CardType.AUTOMATED,
      name,
      tags: [Tags.BUILDING],
      cost: 16,
      adjacencyBonus,
      productionDelta: Units.of({energy: -1, megacredits: 4}),
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
